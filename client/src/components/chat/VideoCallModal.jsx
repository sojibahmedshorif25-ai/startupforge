import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff, FiTv } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VideoCallModal({ isOpen, onClose, partnerName = 'Candidate' }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Timer counter
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Initialize local camera stream
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        toast.error('Camera/Microphone permission needed for HD video call.');
      }
    }
    startCamera();

    return () => {
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    }
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => (t.enabled = !camOn));
    }
    setCamOn(!camOn);
  };

  const toggleScreenShare = () => {
    setSharingScreen(!sharingScreen);
    if (!sharingScreen) {
      toast.success('Screen sharing activated');
    } else {
      toast('Screen sharing stopped');
    }
  };

  if (!isOpen) return null;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl overflow-hidden relative flex flex-col h-[600px]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live WebRTC Interview Room
            </span>
            <h3 className="font-extrabold text-white text-lg mt-1">{partnerName}</h3>
          </div>
          <div className="px-4 py-1.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-bold">
            ⏱️ {formatTime(callDuration)}
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 py-4 relative">
          {/* Main Remote / Partner Video */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80"
              alt={partnerName}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-white text-xs font-bold">
              {partnerName} (Remote HD)
            </div>
          </div>

          {/* Local User Self Video */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            {camOn ? (
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500">
                <FiVideoOff size={40} className="mb-2" />
                <p className="text-xs font-bold">Camera Muted</p>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-white text-xs font-bold">
              You ({sharingScreen ? 'Sharing Screen' : 'Local HD'})
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={toggleMic}
            className={`p-4 rounded-2xl font-bold transition-all border ${
              micOn
                ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
            }`}
            title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micOn ? <FiMic size={20} /> : <FiMicOff size={20} />}
          </button>

          <button
            onClick={toggleCam}
            className={`p-4 rounded-2xl font-bold transition-all border ${
              camOn
                ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
            }`}
            title={camOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {camOn ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-2xl font-bold transition-all border ${
              sharingScreen
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Share Screen"
          >
            <FiTv size={20} />
          </button>

          <button
            onClick={() => {
              toast('Call ended');
              onClose();
            }}
            className="p-4 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 transition-all font-bold shadow-lg shadow-rose-600/30"
            title="End Video Interview"
          >
            <FiPhoneOff size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
