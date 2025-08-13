import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// This is a self-contained component, so we'll re-include the script
const PeerJS = `
<script src="https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js"></script>
`;

 const LiveSessionRoom = ({ sessionRoomId, onLeave }) => {
  const [roomId, setRoomId] = useState('');
  const [peerId, setPeerId] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const peerInstance = useRef(null);
  const myVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const connections = useRef({});

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Custom Error Modal Component
  const ErrorModal = ({ message, onClose }) => {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[100] flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
          <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
          <p className="text-gray-700 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Helper function to show a custom error modal
  const handleShowError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };
  
  // Clean up PeerJS connections and media streams
  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerInstance.current) {
      peerInstance.current.destroy();
    }
    setLocalStream(null);
    setRemoteStreams({});
    setChatMessages([]);
    setIsJoined(false);
    setPeerId('');
  };

  useEffect(() => {
    // Dynamically load PeerJS script
    const script = document.createElement('script');
    script.src = "https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js";
    script.onload = () => {
      initializePeer();
    };
    document.body.appendChild(script);

    return () => {
      cleanup();
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Automatically join the room if a sessionRoomId is provided
    if (sessionRoomId && !isJoined && peerInstance.current) {
      setRoomId(sessionRoomId);
      handleJoinRoom(sessionRoomId);
    }
  }, [sessionRoomId, isJoined, peerInstance.current]);

  const initializePeer = () => {
    const id = `peer-${Math.random().toString(36).substring(2, 9)}`;
    setPeerId(id);

    try {
      const peer = new window.Peer(id, {
        host: 'peerjs.com',
        secure: true,
        port: 443
      });

      peerInstance.current = peer;

      peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
      });

      peer.on('call', (call) => {
        call.answer(localStream);
        
        call.on('stream', (remoteStream) => {
          console.log('Received remote stream:', call.peer);
          setRemoteStreams(prev => ({
            ...prev,
            [call.peer]: remoteStream
          }));
        });
      });

      peer.on('connection', (conn) => {
        connections.current[conn.peer] = conn;
        
        conn.on('data', (data) => {
          setChatMessages(prev => [...prev, data]);
        });
        conn.on('close', () => {
          console.log(`Connection with ${conn.peer} closed.`);
        });
      });

      peer.on('error', (err) => {
        console.error('PeerJS error:', err);
        handleShowError('A PeerJS error occurred. Please try again.');
        cleanup();
      });
    } catch (err) {
      console.error('Failed to initialize PeerJS:', err);
      handleShowError('Failed to initialize PeerJS. Check your network connection.');
    }
  };

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      handleShowError('Could not access your camera or microphone. Please check permissions.');
      return null;
    }
  };
  
  const connectToPeers = (room, stream) => {
    const peersInRoom = JSON.parse(localStorage.getItem(room) || '[]');
    peersInRoom.forEach(remotePeerId => {
      if (remotePeerId !== peerId) {
        console.log(`Calling peer: ${remotePeerId}`);
        const call = peerInstance.current.call(remotePeerId, stream);
        
        call.on('stream', (remoteStream) => {
          console.log('Received remote stream from call:', remotePeerId);
          setRemoteStreams(prev => ({
            ...prev,
            [remotePeerId]: remoteStream
          }));
        });
        
        const conn = peerInstance.current.connect(remotePeerId);
        conn.on('open', () => {
          console.log(`Data connection opened with ${remotePeerId}`);
          connections.current[remotePeerId] = conn;
        });
      }
    });
  };

  const handleCreateRoom = async () => {
    const newRoomId = `room-${crypto.randomUUID()}`;
    setRoomId(newRoomId);

    const stream = await getLocalStream();
    if (stream) {
      localStorage.setItem(newRoomId, JSON.stringify([peerId]));
      setIsJoined(true);
      connectToPeers(newRoomId, stream);
    }
  };

  const handleJoinRoom = async (joinRoomId) => {
    const stream = await getLocalStream();
    if (stream) {
      const peersInRoom = JSON.parse(localStorage.getItem(joinRoomId) || '[]');
      if (peersInRoom.length === 0) {
        // If the room doesn't exist, we assume we are the first person
        // to arrive and create it.
        localStorage.setItem(joinRoomId, JSON.stringify([peerId]));
      } else {
        // If the room exists, add our peerId to it.
        peersInRoom.push(peerId);
        localStorage.setItem(joinRoomId, JSON.stringify(peersInRoom));
      }
      setIsJoined(true);
      connectToPeers(joinRoomId, stream);
    }
  };

  const removePeerFromRoom = (room, peerId) => {
    const peersInRoom = JSON.parse(localStorage.getItem(room) || '[]').filter(id => id !== peerId);
    localStorage.setItem(room, JSON.stringify(peersInRoom));
  };
  
  const handleLeaveRoom = () => {
    console.log('Leaving room...');
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    peerInstance.current.disconnect();
    peerInstance.current.destroy();
    removePeerFromRoom(roomId, peerId);
    cleanup();
    onLeave(); // Call the prop function to navigate back to the dashboard
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
      });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
        setIsVideoOff(!track.enabled);
      });
    }
  };

  useEffect(() => {
    if (localStream && myVideoRef.current && !myVideoRef.current.srcObject) {
      myVideoRef.current.srcObject = localStream;
    }
    
    Object.keys(remoteStreams).forEach(peerId => {
      const videoEl = remoteVideoRefs.current[peerId];
      if (videoEl && remoteStreams[peerId] && !videoEl.srcObject) {
        videoEl.srcObject = remoteStreams[peerId];
      }
    });
  }, [localStream, remoteStreams]);

  const Chat = () => {
    const [message, setMessage] = useState('');
    const chatRef = useRef(null);

    const handleSendMessage = (e) => {
      e.preventDefault();
      if (!message.trim()) return;

      const chatMsg = { sender: peerId, text: message, timestamp: new Date().toLocaleTimeString() };
      setChatMessages(prev => [...prev, chatMsg]);

      Object.values(connections.current).forEach(conn => {
        if (conn.open) {
          conn.send(chatMsg);
        }
      });
      setMessage('');
    };

    useEffect(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, [chatMessages, showChat]);

    return (
      <div className={`flex flex-col h-full bg-gray-800 rounded-xl transition-all duration-300 ${showChat ? 'w-full md:w-80' : 'w-0 overflow-hidden'}`}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatRef}>
          {chatMessages.length === 0 && (
            <p className="text-gray-400 text-center text-sm italic mt-4">No messages yet...</p>
          )}
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === peerId ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-[80%] break-words ${msg.sender === peerId ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <p className="font-bold text-xs mb-1">{msg.sender === peerId ? 'You' : `Peer ${msg.sender.substring(6, 12)}`}</p>
                <p className="text-sm">{msg.text}</p>
                <span className="block text-right text-[10px] text-gray-400 mt-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-full transition-transform transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l.647-.289a1 1 0 00.554-.925V13.88a1 1 0 011-.925h7a1 1 0 011 .925v2.859a1 1 0 00.554.925l.647.289a1 1 0 001.169-1.409l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  // Logic to show the join screen if no sessionRoomId is provided
  // This allows the component to be used both integrated and manually
  if (!isJoined && !sessionRoomId) {
    return (
      <div className="min-h-screen mt-20  flex items-center justify-center bg-gray-900 text-white p-4">
        {showErrorModal && <ErrorModal message={errorMessage} onClose={() => setShowErrorModal(false)} />}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center">
          <h1 className="text-4xl font-extrabold text-indigo-400 mb-6">StudyConnect Live Session</h1>
          <p className="text-gray-400 mb-8">Join or create a live tutoring room.</p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="flex-1 p-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleJoinRoom(roomId)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-transform transform hover:scale-105"
              >
                Join Room
              </button>
            </div>
            <div className="flex items-center">
              <div className="flex-1 h-[2px] bg-gray-700"></div>
              <span className="mx-4 text-gray-500">OR</span>
              <div className="flex-1 h-[2px] bg-gray-700"></div>
            </div>
            <button
              onClick={handleCreateRoom}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full transition-transform transform hover:scale-105"
            >
              Create New Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Live session view
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {showErrorModal && <ErrorModal message={errorMessage} onClose={() => setShowErrorModal(false)} />}
      <header className="p-4 bg-gray-800 shadow-lg flex justify-between items-center z-10">
        <h2 className="text-xl font-bold text-indigo-400">Room: {sessionRoomId}</h2>
        <div className="flex space-x-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMuted ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a4 4 0 01-4-4V6a4 4 0 014-4v2a2 2 0 002 2v4m-2 2a2 2 0 002-2v-4a2 2 0 00-2-2m-2-2a2 2 0 00-2-2V6a2 2 0 00-2-2m-2-2h4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a4 4 0 01-4-4V6a4 4 0 014-4v2a2 2 0 002 2v4m-2 2a2 2 0 002-2v-4a2 2 0 00-2-2" />
              )}
            </svg>
          </button>
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${isVideoOff ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isVideoOff ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 11V7a2 2 0 012-2h4l2-3h5a2 2 0 012 2v1a2 2 0 012 2v5c0 1.657-1.343 3-3 3H7a3 3 0 01-3-3v-4zm-2 1h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 11V7a2 2 0 012-2h4l2-3h5a2 2 0 012 2v1a2 2 0 012 2v5c0 1.657-1.343 3-3 3H7a3 3 0 01-3-3v-4z" />
              )}
            </svg>
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.52 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button
            onClick={handleLeaveRoom}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
          >
            Leave
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden p-4">
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-auto p-2">
            {/* My Video */}
            <div className="relative flex-1 bg-gray-800 rounded-xl overflow-hidden shadow-xl min-h-[200px]">
              <video
                ref={myVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-xl"
              ></video>
              <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-50 text-white px-3 py-1 rounded-full font-semibold text-sm">
                You
              </div>
            </div>
            
            {/* Remote Videos */}
            {Object.keys(remoteStreams).map(peerId => (
              <div key={peerId} className="relative flex-1 bg-gray-800 rounded-xl overflow-hidden shadow-xl min-h-[200px]">
                <video
                  ref={el => remoteVideoRefs.current[peerId] = el}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-xl"
                ></video>
                <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-50 text-white px-3 py-1 rounded-full font-semibold text-sm">
                  Peer {peerId.substring(6, 12)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Panel */}
        {showChat && (
          <div className="w-full md:w-80 h-full md:h-auto flex-shrink-0 mt-4 md:mt-0 md:ml-4">
            <Chat />
          </div>
        )}
      </div>
    </div>
  );
};



// Main entry point for the React app
const domNode = document.getElementById('root');
if (domNode) {
  const root = createRoot(domNode);
  root.render(<LiveSessionRoom />);
}
export default LiveSessionRoom;