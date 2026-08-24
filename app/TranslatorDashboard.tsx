import React, { useState } from 'react';

export default function TranslatorDashboard({ globalOrders, setGlobalOrders, currentUser }: { globalOrders: any[], setGlobalOrders: any, currentUser: any }) {
  const [activeTab, setActiveTab] = useState('new_manual');
  
  // State to hold the two separate file uploads per order
  const [uploadStates, setUploadStates] = useState<{[key:string]: {orig: File|null, word: File|null}}>({});

  const newOrders = globalOrders.filter(order => order.status === 'Awaiting Translator');
  const inProgressOrders = globalOrders.filter(order => order.status === 'In Progress');
  const aiReviewQueue = globalOrders.filter(order => order.status === 'AI Review');
  const manualFixQueue = globalOrders.filter(order => order.status === 'Manual Fix Needed');

  const handleFileSelect = (orderId: string, type: 'orig' | 'word', file: File) => {
    setUploadStates(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [type]: file
      }
    }));
  };

  const claimOrder = (orderId: string) => {
    const updatedOrders = globalOrders.map(order => {
      if(order.id === orderId) {
        return { 
          ...order, 
          status: 'In Progress',
          history: [...order.history, {
            step: 'Order Claimed',
            timestamp: new Date().toLocaleString(),
            details: `${currentUser.name} claimed the order and began translation.`
          }]
        };
      }
      return order;
    });
    setGlobalOrders(updatedOrders);
  };

  const submitFinishedTranslation = (orderId: string) => {
    const files = uploadStates[orderId];
    if(!files || !files.orig || !files.word) return;

    const updatedOrders = globalOrders.map(order => {
      if(order.id === orderId) {
        return { 
          ...order, 
          status: 'Ready to Print', 
          translatorOrigFile: files.orig.name,
          translatorWordFile: files.word.name,
          history: [...order.history, {
            step: 'Translated & Marked Finished',
            timestamp: new Date().toLocaleString(),
            details: `${currentUser.name} uploaded original PDF (${files.orig.name}) and Word Doc (${files.word.name}). Sent to Front Desk.`
          }]
        };
      }
      return order;
    });
    setGlobalOrders(updatedOrders);
    
    // Clear upload state for this order
    setUploadStates(prev => {
      const newState = {...prev};
      delete newState[orderId];
      return newState;
    });
  };

  return (
    <div className="flex min-h-[90vh]">
      <nav className="w-64 bg-white border-r p-6 shadow-sm hidden md:block">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab('new_manual')}
              className={`w-full text-left py-3 px-4 font-bold flex justify-between items-center ${activeTab === 'new_manual' ? 'bg-red-50 text-red-900 border-l-4 border-yellow-500' : 'text-gray-600 hover:bg-gray-50 transition'}`}
            >
              <span>New Manual Orders</span>
              <span className="bg-red-800 text-white text-xs px-2 py-1 rounded-full">{newOrders.length}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('working')}
              className={`w-full text-left py-3 px-4 font-bold flex justify-between items-center ${activeTab === 'working' ? 'bg-red-50 text-red-900 border-l-4 border-yellow-500' : 'text-gray-600 hover:bg-gray-50 transition'}`}
            >
              <span>In Progress</span>
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">{inProgressOrders.length}</span>
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('ai')} className={`w-full text-left py-3 px-4 font-bold flex justify-between items-center ${activeTab === 'ai' ? 'bg-red-50 text-red-900 border-l-4 border-yellow-500' : 'text-gray-600 hover:bg-gray-50 transition'}`}>
              <span>AI Review Queue</span>
              <span className="bg-slate-300 text-slate-800 text-xs px-2 py-1 rounded-full">{aiReviewQueue.length}</span>
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('manual')} className={`w-full text-left py-3 px-4 font-bold flex justify-between items-center ${activeTab === 'manual' ? 'bg-red-50 text-red-900 border-l-4 border-yellow-500' : 'text-gray-600 hover:bg-gray-50 transition'}`}>
              <span>Needs Manual Fix</span>
              <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">{manualFixQueue.length}</span>
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-1 p-8 bg-gray-50">
        
        {/* --- NEW MANUAL ORDERS TAB --- */}
        {activeTab === 'new_manual' && (
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black text-gray-800 mb-6">Unassigned Customer Orders</h2>
            
            {newOrders.length === 0 ? (
               <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                 <p className="text-gray-500 text-lg font-medium">No new orders are currently waiting.</p>
               </div>
            ) : (
               newOrders.map((order) => (
                 <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 border-l-4 border-l-red-800">
                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                      <div>
                         <h4 className="font-black text-gray-800 text-xl">{order.type} - Order #{order.id}</h4>
                         <p className="text-sm text-gray-500 mt-1 font-bold">Customer: {order.customer}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">Awaiting Translator</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-xs font-bold text-blue-900 uppercase mb-1">Exact Names Required</p>
                        <p className="text-sm font-medium text-gray-800">{order.exactNamesProvided || "None provided"}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Additional Notes</p>
                        <p className="text-sm font-medium text-gray-800">{order.additionalNotes || "No extra notes."}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 mb-6">
                      <button className="flex-1 bg-white border border-gray-300 text-slate-800 hover:bg-slate-50 font-bold py-2 rounded-lg transition shadow-sm text-sm">
                        📄 Download Main File: {order.mainFileName}
                      </button>
                      <button className="flex-1 bg-white border border-gray-300 text-slate-800 hover:bg-slate-50 font-bold py-2 rounded-lg transition shadow-sm text-sm">
                        🪪 Download ID/Passport: {order.referenceFileName}
                      </button>
                    </div>
                    
                    <button onClick={() => claimOrder(order.id)} className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-4 rounded-xl shadow-md transition text-lg uppercase tracking-wide">
                      ✅ Claim Order & Move to In Progress
                    </button>
                 </div>
               ))
            )}
          </div>
        )}

        {/* --- IN PROGRESS TAB --- */}
        {activeTab === 'working' && (
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black text-gray-800 mb-6">Your Active Translations</h2>
            
            {inProgressOrders.length === 0 ? (
               <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                 <p className="text-gray-500 text-lg font-medium">You have no active orders in progress.</p>
               </div>
            ) : (
               inProgressOrders.map((order) => {
                 const orderUploads = uploadStates[order.id] || { orig: null, word: null };
                 const canSubmit = orderUploads.orig !== null && orderUploads.word !== null;

                 return (
                 <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 border-t-4 border-t-yellow-500">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                        <h4 className="font-bold text-gray-800 text-xl">{order.type} - Order #{order.id}</h4>
                        <p className="text-sm text-yellow-600 font-bold mt-1">Status: Translating...</p>
                     </div>
                   </div>

                   <div className="flex gap-4 mb-6">
                      <button className="flex-1 bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 font-bold py-2 rounded-lg transition text-sm">
                        ⬇️ Download Main: {order.mainFileName}
                      </button>
                      <button className="flex-1 bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 font-bold py-2 rounded-lg transition text-sm">
                        ⬇️ Download ID: {order.referenceFileName}
                      </button>
                   </div>
                   
                   <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mt-4 text-center">
                      <h5 className="font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm border-b pb-2">Upload Finished Translations</h5>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {/* Upload Original/PDF */}
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white hover:border-red-400 cursor-pointer transition">
                          <input type="file" accept=".pdf" onChange={(e: any) => handleFileSelect(order.id, 'orig', e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          {orderUploads.orig ? (
                             <span className="text-green-600 font-bold text-sm block">✅ {orderUploads.orig.name}</span>
                          ) : (
                             <>
                               <span className="text-2xl mb-1 block">📄</span>
                               <span className="text-red-800 font-bold text-sm">Upload Edited PDF</span>
                             </>
                          )}
                        </div>

                        {/* Upload Word Doc */}
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white hover:border-red-400 cursor-pointer transition">
                          <input type="file" accept=".doc,.docx" onChange={(e: any) => handleFileSelect(order.id, 'word', e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          {orderUploads.word ? (
                             <span className="text-green-600 font-bold text-sm block">✅ {orderUploads.word.name}</span>
                          ) : (
                             <>
                               <span className="text-2xl mb-1 block">📝</span>
                               <span className="text-red-800 font-bold text-sm">Upload Word Doc</span>
                             </>
                          )}
                        </div>
                      </div>
                   </div>

                   <button 
                     onClick={() => submitFinishedTranslation(order.id)}
                     disabled={!canSubmit}
                     className={`w-full font-bold py-5 rounded-xl shadow-lg mt-6 transition text-lg uppercase tracking-wide ${canSubmit ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                     Submit to Front Desk Print Queue
                   </button>
                 </div>
               )})
            )}
          </div>
        )}

        {/* AI & MANUAL TABS */}
        {activeTab === 'ai' && (
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-6">AI Translations Pending Approval</h2>
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
               <p className="text-gray-500 text-lg font-medium">No AI documents currently require review.</p>
            </div>
          </div>
        )}
        {activeTab === 'manual' && (
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-6">Manual Fixes Required</h2>
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
               <p className="text-gray-500 text-lg font-medium">No orders are currently awaiting manual fixes.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
