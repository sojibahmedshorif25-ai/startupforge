export default function Loader({ fullScreen = true }) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-20'} bg-gray-50`}>
      <div className="text-center">
        <div className="loader loader-lg mx-auto mb-6"></div>
        <p className="text-gray-500 font-medium text-lg">Loading</p>
        <div className="flex justify-center space-x-1 mt-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
        </div>
      </div>
    </div>
  );
}
