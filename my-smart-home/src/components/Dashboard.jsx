import React, { useState } from 'react';

function Dashboard() {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Living Room Light', type: 'light', status: 'on', room: 'Living Room' },
    { id: 2, name: 'Bedroom AC', type: 'ac', status: 'off', room: 'Bedroom', temperature: 22 },
    { id: 3, name: 'Kitchen Fan', type: 'fan', status: 'on', room: 'Kitchen', speed: 2 },
    { id: 4, name: 'Front Door Lock', type: 'lock', status: 'locked', room: 'Entrance' },
  ]);

  const toggleDevice = (id) => {
    setDevices(devices.map(device => {
      if (device.id === id) {
        if (device.type === 'light' || device.type === 'fan') {
          return { ...device, status: device.status === 'on' ? 'off' : 'on' };
        } else if (device.type === 'ac') {
          return { ...device, status: device.status === 'on' ? 'off' : 'on' };
        } else if (device.type === 'lock') {
          return { ...device, status: device.status === 'locked' ? 'unlocked' : 'locked' };
        }
      }
      return device;
    }));
  };

  const getDeviceIcon = (type, status) => {
    switch (type) {
      case 'light': return status === 'on' ? '💡' : '🔅';
      case 'ac': return status === 'on' ? '❄️' : '🌡️';
      case 'fan': return status === 'on' ? '💨' : '🔄';
      case 'lock': return status === 'locked' ? '🔒' : '🔓';
      default: return '📱';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on': return 'bg-green-50 text-green-700 border-green-200';
      case 'off': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'locked': return 'bg-red-50 text-red-700 border-red-200';
      case 'unlocked': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
      {/* Header Section with Gradient */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-3">Device Dashboard</h2>
          <p className="text-blue-100 text-lg">Control your smart home devices with style</p>
          <div className="mt-6 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">All systems online</span>
            </div>
            <div className="text-sm opacity-75">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {devices.map((device) => (
          <div
            key={device.id}
            className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-blue-200"
          >
            {/* Device Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                  {getDeviceIcon(device.type, device.status)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    {device.type}
                  </span>
                </div>
              </div>
              <div className="relative">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(device.status)} border`}
                >
                  {device.status}
                </span>
                {(device.status === 'on' || device.status === 'locked') && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                )}
              </div>
            </div>

            {/* Device Info */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {device.name}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="mr-2">📍</span>
                  <span className="font-medium">{device.room}</span>
                </div>

                {device.type === 'ac' && device.temperature && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="mr-2">🌡️</span>
                    <span>{device.temperature}°C</span>
                    <div className="ml-auto">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                          style={{ width: `${(device.temperature / 30) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {device.type === 'fan' && device.speed && device.status === 'on' && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="mr-2">⚡</span>
                    <span>Speed: {device.speed}</span>
                    <div className="ml-auto flex space-x-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-4 rounded-sm ${
                            level <= device.speed ? 'bg-green-400' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Control Button */}
            <button
              onClick={() => toggleDevice(device.id)}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 shadow-lg ${
                device.status === 'on' || device.status === 'locked'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-200'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 shadow-gray-200'
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>
                  {device.type === 'lock' 
                    ? (device.status === 'locked' ? '🔓 Unlock' : '🔒 Lock')
                    : (device.status === 'on' ? '⏹️ Turn Off' : '▶️ Turn On')
                  }
                </span>
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Enhanced Statistics Section */}
      <div className="mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Smart Home Analytics</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Active Devices */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 group-hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      {devices.filter(d => d.status === 'on').length}
                    </div>
                    <div className="text-green-700 font-medium">Active</div>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium">Devices Running</div>
                <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(devices.filter(d => d.status === 'on').length / devices.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Inactive Devices */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 group-hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-500 rounded-xl">
                    <span className="text-white text-xl">⏸️</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-600">
                      {devices.filter(d => d.status === 'off').length}
                    </div>
                    <div className="text-gray-700 font-medium">Inactive</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-medium">Devices Off</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(devices.filter(d => d.status === 'off').length / devices.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 group-hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500 rounded-xl">
                    <span className="text-white text-xl">🔒</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600">
                      {devices.filter(d => d.status === 'locked').length}
                    </div>
                    <div className="text-red-700 font-medium">Secured</div>
                  </div>
                </div>
                <div className="text-sm text-red-600 font-medium">Security Devices</div>
                <div className="mt-2 w-full bg-red-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(devices.filter(d => d.status === 'locked').length / devices.filter(d => d.type === 'lock').length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Total Devices */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 group-hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <span className="text-white text-xl">🏠</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {devices.length}
                    </div>
                    <div className="text-blue-700 font-medium">Total</div>
                  </div>
                </div>
                <div className="text-sm text-blue-600 font-medium">Connected Devices</div>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-full transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Usage Simulation */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Energy Usage Today</h4>
              <span className="text-sm text-gray-500">Last 24 hours</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Energy consumption</span>
                  <span>
                    {devices.filter(d => d.status === 'on').length * 0.5 + 
                     devices.filter(d => d.type === 'ac' && d.status === 'on').length * 2.5} kWh
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((devices.filter(d => d.status === 'on').length / devices.length) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl">
                {devices.filter(d => d.status === 'on').length > 2 ? '⚡' : '🌱'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;
