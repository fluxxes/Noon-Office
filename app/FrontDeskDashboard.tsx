import React, { useState } from 'react';

export default function FrontDeskDashboard({ globalOrders, setGlobalOrders, currentUser }: { globalOrders: any[], setGlobalOrders: any, currentUser: any }) {
  const [activeView, setActiveView] = useState('home');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [finalScannedFile, setFinalScannedFile] = useState<File | null>(null);

  const readyOrders = globalOrders.filter(order => order.status === 'Ready to Print');
  const activeQueue = globalOrders.filter(order => order.status === 'In Progress' || order.status === 'Awaiting Translator');

  const closeAndSendToManager = (orderId: string) => {
    if(!finalScannedFile) return;
    const updatedOrders = globalOrders.map(order => {
      if(order.id === orderId) {
        return { 
          ...order, 
          status: 'Awaiting Manager Closure', 
          finalScannedFile: finalScannedFile.name,
          history: [...order.history, {
            step: 'Printed, Stamped & Scanned',
            timestamp: new Date().toLocaleString(),
            details: `${currentUser.name} uploaded final stamped PDF (${finalScannedFile.name}). Sent to Manager.`
          }]
        };
      }
      return order;
    });
    setGlobalOrders(updatedOrders);
    setSelectedOrder(null);
    setFinalScannedFile(null);
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border-t-4 border-red-800 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
            <h3 className="text-xl font-black text-gray-800">Order #{selectedOrder.id}</h3>
            <button onClick={() => { setSelectedOrder(null); setFinalScannedFile(null); }} className="text-gray-400 hover:text-red-800 font-bold text-2xl outline-none">&times;</button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Customer</p>
                <p className="font-bold text-gray-900 text-lg">{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Document Type</p>
                <p className="font-bold text-gray-900 text-lg">{selectedOrder.type}</p>
              </div>
            </div>
            
            {/* Note: Customer Raw Files are NOT rendered here, as requested */}

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">1. Print Digital Translations</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded shadow-sm">
                  <p className="text-sm font-bold text-gray-800">📄 {selectedOrder.translatorOrigFile}</p>
                  <button className="text-red-800 font-bold text-sm">Download</button>
                </div>
                <div className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded shadow-sm">
                  <p className="text-sm font-bold text-gray-800">📝 {selectedOrder.translatorWordFile}</p>
                  <button className="text-red-800 font-bold text-sm">Download</button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm font-bold text-yellow-900 mb-3 uppercase tracking-wider">2. Upload Signed/Stamped Copy</p>
              <p className="text-xs text-gray-600 mb-3 font-medium">Scan the stamped translation with the original document as a single PDF.</p>
              
              <div className="relative border-2 border-dashed border-yellow-400 rounded-xl p-6 bg-white hover:border-red-400 cursor-pointer transition text-center mb-4">
                 <input type="file" accept=".pdf" onChange={(e: any) => setFinalScannedFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                 {finalScannedFile ? (
                    <span className="text-green-600 font-bold text-sm">Attached: {finalScannedFile.name}</span>
                 ) : (
                    <span className="text-red-800 font-bold">Click to Upload Final Scan</span>
                 )}
              </div>

              <button 
                onClick={() => closeAndSendToManager(selectedOrder.id)}
                disabled={!finalScannedFile}
                className={`w-full font-bold py-3 rounded-lg shadow transition ${finalScannedFile ? 'bg-slate-900 hover:bg-black text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                Submit to Manager & Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[90vh] bg-gray-50 p-8 relative">
      <OrderDetailsModal />
      {activeView === 'home' && (
        <div className="flex flex-col items-center justify-center pt-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-full shadow-lg border-8 border-red-800 text-center w-64 h-64 flex flex-col items-center justify-center mb-12 hover:scale-105 transition-transform duration-300">
            <span className="text-7xl font-black text-red-800 leading-none">{readyOrders.length}</span>
            <span className="text-gray-600 font-bold uppercase tracking-widest mt-2 text-sm">Ready to Print</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button onClick={() => setActiveView('ready')} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-yellow-500 hover:shadow-md transition flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-yellow-100 transition">🖨️</div>
              <span className="font-black text-gray-800 text-lg mb-1">View Print Orders</span>
            </button>
            <button onClick={() => setActiveView('queue')} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-slate-800 hover:shadow-md transition flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-slate-200 transition">⏳</div>
              <span className="font-black text-gray-800 text-lg mb-1">Active Queue</span>
            </button>
          </div>
        </div>
      )}

      {activeView === 'ready' && (
        <div className="max-w-6xl mx-auto">
          <button onClick={() => setActiveView('home')} className="text-red-800 font-bold mb-8 hover:underline flex items-center gap-2">← Back to Main Hub</button>
          <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
            <span className="bg-yellow-500 text-white w-10 h-10 flex items-center justify-center rounded-full text-lg">🖨️</span> Orders Ready to Print
          </h2>
          
          {readyOrders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
               <p className="text-gray-500 text-lg font-medium">There are currently no orders ready to print.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {readyOrders.map((order) => (
                <div key={order.id} onClick={() => setSelectedOrder(order)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:border-red-800 hover:shadow-lg transition flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gray-50 text-red-800 rounded-xl flex items-center justify-center text-4xl mb-4 border border-gray-100 shadow-inner">📑</div>
                  <h4 className="font-bold text-gray-900 text-lg">{order.customer}</h4>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{order.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'queue' && (
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setActiveView('home')} className="text-red-800 font-bold mb-6 hover:underline flex items-center gap-2">← Back to Main Hub</button>
          <h2 className="text-3xl font-black text-gray-800 mb-6">Active Translating Queue</h2>
          
          {activeQueue.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
               <p className="text-gray-500 text-lg font-medium">There are currently no orders in progress.</p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              {activeQueue.map((order) => (
                <div key={order.id} className="pb-4 flex justify-between items-center border-b mb-4 last:border-0">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{order.type} - Customer: {order.customer}</h4>
                    <p className="text-sm text-gray-500 font-medium mt-1">Status: {order.status}</p>
                  </div>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 font-bold text-sm rounded-full border border-blue-200">Tracking</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}