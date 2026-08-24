import React, { useState } from 'react';

export default function ManagerDashboard({ globalOrders, setGlobalOrders, currentUser }: { globalOrders: any[], setGlobalOrders: any, currentUser: any }) {
  const [activeTab, setActiveTab] = useState('reports');
  const [reportToPrint, setReportToPrint] = useState<any | null>(null);

  const completedOrders = globalOrders.filter(order => order.status === 'Awaiting Manager Closure');
  const recentActivity = globalOrders.filter(order => order.status === 'Closed' || order.status === 'Archived');

  const closeAndPurge = (orderId: string, action: 'Closed' | 'Archived') => {
    const updatedOrders = globalOrders.map(order => 
      order.id === orderId ? { 
        ...order, 
        status: action,
        history: [...order.history, {
          step: `Order ${action} & Cloud Shredded`,
          timestamp: new Date().toLocaleString(),
          details: `${currentUser.name} authorized permanent deletion of temporary cloud files.`
        }]
      } : order
    );
    setGlobalOrders(updatedOrders);
    alert(`Order ${action} and files shredded from temporary cloud storage securely.`);
  };

  // AUTOMATED REAL REPORT GENERATOR
  const generateReports = () => {
    const reports: any = {};
    
    globalOrders.forEach(order => {
      // Create date object safely
      const d = new Date(order.date);
      const monthName = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      // Calculate which week of the month (1 through 4)
      let weekNum = Math.ceil(d.getDate() / 7);
      if (weekNum > 4) weekNum = 4; // Caps at week 4 per your request
      const weekStr = `Week ${weekNum}`;
      const key = `${monthName}-${weekStr}`;

      if (!reports[key]) {
        reports[key] = {
          id: key,
          month: monthName,
          week: weekStr,
          cash: 0,
          card: 0,
          transfer: 0,
          missing: 0, // Manual override tracked elsewhere
          total: 0,
          orders: []
        };
      }

      const price = Number(order.price) || 0;
      reports[key].total += price;
      
      if (order.paymentMethod === 'Cash') reports[key].cash += price;
      else if (order.paymentMethod === 'Card') reports[key].card += price;
      else if (order.paymentMethod === 'Bank Transfer') reports[key].transfer += price;

      reports[key].orders.push(order);
    });

    return Object.values(reports).reverse(); // Newest first
  };

  const realReports = generateReports();

  // Print View Overlay
  if (reportToPrint) {
    return (
      <div className="min-h-screen bg-white p-12 font-sans">
        <div className="flex justify-between items-center mb-8 border-b-4 border-slate-900 pb-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">NOON <span className="text-red-800">OFFICE</span></h1>
            <p className="text-xl font-bold text-gray-500 mt-2">Financial Report: {reportToPrint.month} - {reportToPrint.week}</p>
          </div>
          <div className="flex gap-4 print:hidden">
            <button onClick={() => window.print()} className="bg-red-800 text-white font-bold py-2 px-6 rounded-lg">Print Report</button>
            <button onClick={() => setReportToPrint(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg">Close</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 p-6 rounded border border-gray-200">
            <p className="text-sm font-bold text-gray-500 uppercase">Total Cash</p>
            <p className="text-3xl font-black text-green-700">{reportToPrint.cash} SAR</p>
          </div>
          <div className="bg-gray-50 p-6 rounded border border-gray-200">
            <p className="text-sm font-bold text-gray-500 uppercase">Total Card</p>
            <p className="text-3xl font-black text-blue-700">{reportToPrint.card} SAR</p>
          </div>
          <div className="bg-gray-50 p-6 rounded border border-gray-200">
            <p className="text-sm font-bold text-gray-500 uppercase">Bank Transfer</p>
            <p className="text-3xl font-black text-purple-700">{reportToPrint.transfer} SAR</p>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-3 font-bold">Order ID</th>
              <th className="p-3 font-bold">Customer</th>
              <th className="p-3 font-bold">Type</th>
              <th className="p-3 font-bold">Method</th>
              <th className="p-3 font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportToPrint.orders.map((o: any) => (
              <tr key={o.id} className="border-b">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.customer}</td>
                <td className="p-3">{o.type}</td>
                <td className="p-3 font-bold text-gray-600">{o.paymentMethod}</td>
                <td className="p-3 font-bold">{o.price} SAR</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="flex min-h-[90vh]">
      <nav className="w-64 bg-slate-900 border-r border-gray-800 p-6 shadow-sm hidden md:block text-white">
        <ul className="space-y-2">
          <li>
            <button onClick={() => setActiveTab('reports')} className={`w-full text-left py-3 px-4 font-bold ${activeTab === 'reports' ? 'bg-slate-800 border-l-4 border-yellow-500' : 'text-gray-400 hover:bg-slate-800 transition'}`}>
              Financial Reports
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('overview')} className={`w-full text-left py-3 px-4 font-bold ${activeTab === 'overview' ? 'bg-slate-800 border-l-4 border-yellow-500' : 'text-gray-400 hover:bg-slate-800 transition'}`}>
              Master Overview
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('review')} className={`w-full text-left py-3 px-4 font-bold flex justify-between items-center ${activeTab === 'review' ? 'bg-slate-800 border-l-4 border-yellow-500' : 'text-gray-400 hover:bg-slate-800 transition'}`}>
              <span>Final Review & Close</span>
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">{completedOrders.length}</span>
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-1 p-8 bg-gray-50">
        
        {/* --- AUTOMATED FINANCIAL REPORTS TAB --- */}
        {activeTab === 'reports' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-gray-800">Automated Financial Reports</h2>
              <button className="bg-slate-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-800 transition">Force Sync Data</button>
            </div>
            
            {realReports.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                 <p className="text-gray-500 text-lg font-medium">No sales data exists yet. Process an order to generate a report.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {realReports.map((report: any) => (
                  <div key={report.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b pb-3 mb-4">
                      <h4 className="font-black text-gray-800 text-lg">{report.month}</h4>
                      <p className="text-sm text-gray-500 font-bold">{report.week} - {report.orders.length} Orders</p>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between"><span className="text-sm text-gray-600">Cash:</span><span className="font-bold text-green-700">{report.cash} SAR</span></div>
                      <div className="flex justify-between"><span className="text-sm text-gray-600">Card:</span><span className="font-bold text-blue-700">{report.card} SAR</span></div>
                      <div className="flex justify-between"><span className="text-sm text-gray-600">Transfer:</span><span className="font-bold text-purple-700">{report.transfer} SAR</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setReportToPrint(report)} className="flex-1 bg-red-800 hover:bg-red-900 text-white font-bold py-2 rounded text-xs transition">View & Print</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-8">Executive Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-red-800">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Lifetime Revenue</p>
                <h3 className="text-4xl font-black text-gray-800">
                  {recentActivity.reduce((sum, order) => sum + order.price, 0)} <span className="text-lg text-gray-400">SAR</span>
                </h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-slate-800">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Orders Handled</p>
                <h3 className="text-4xl font-black text-gray-800">{recentActivity.length}</h3>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Archived & Closed Activity</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-medium">No activity to report yet.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 text-sm font-bold text-gray-600">ID</th>
                      <th className="p-4 text-sm font-bold text-gray-600">Customer</th>
                      <th className="p-4 text-sm font-bold text-gray-600">Revenue</th>
                      <th className="p-4 text-sm font-bold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity) => (
                      <tr key={activity.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-gray-800 font-medium">#{activity.id}</td>
                        <td className="p-4 text-gray-800">{activity.customer}</td>
                        <td className="p-4 text-green-700 font-bold">+{activity.price} SAR</td>
                        <td className="p-4 text-gray-500 font-bold">{activity.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               )}
            </div>
          </div>
        )}

        {/* --- FINAL REVIEW TAB WITH TIMELINE --- */}
        {activeTab === 'review' && (
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-8">Completed Orders (Final Review)</h2>
            {completedOrders.length === 0 ? (
               <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                 <p className="text-gray-500 text-lg font-medium">No orders are awaiting final review.</p>
               </div>
            ) : (
               completedOrders.map((order) => (
                 <div key={order.id} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8 border-l-8 border-l-green-600">
                    <div className="flex justify-between items-start mb-6 border-b pb-4">
                      <div>
                        <h4 className="font-black text-gray-800 text-2xl">{order.type} - Order #{order.id}</h4>
                        <p className="text-gray-500 font-bold mt-1">Customer: {order.customer} | Paid: {order.price} SAR via {order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Timeline History */}
                      <div>
                        <h5 className="font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">Chain of Custody Timeline</h5>
                        <div className="border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
                          {order.history.map((event: any, index: number) => (
                            <div key={index} className="relative">
                              <span className="absolute -left-[31px] bg-red-800 w-4 h-4 rounded-full border-2 border-white shadow"></span>
                              <p className="font-bold text-gray-900">{event.step}</p>
                              <p className="text-xs text-gray-400 font-bold mb-1">{event.timestamp}</p>
                              <p className="text-sm text-gray-600">{event.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Employee System Files (Customer files intentionally hidden) */}
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h5 className="font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">Employee System Files</h5>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded shadow-sm">
                            <span className="text-sm font-bold text-gray-800">📄 {order.translatorOrigFile} (Orig/Modified)</span>
                            <button className="text-red-800 font-bold text-xs hover:underline">Download</button>
                          </div>
                          <div className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded shadow-sm">
                            <span className="text-sm font-bold text-gray-800">📝 {order.translatorWordFile} (Word Doc)</span>
                            <button className="text-red-800 font-bold text-xs hover:underline">Download</button>
                          </div>
                          <div className="flex justify-between items-center bg-blue-50 p-3 border border-blue-200 rounded shadow-sm">
                            <span className="text-sm font-bold text-blue-900">📑 {order.finalScannedFile} (Final Scan)</span>
                            <button className="text-blue-800 font-bold text-xs hover:underline">Download</button>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button 
                            onClick={() => closeAndPurge(order.id, 'Archived')}
                            className="flex-1 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 font-bold py-3 rounded-lg shadow transition">
                            📁 Archive Order
                          </button>
                          <button 
                            onClick={() => closeAndPurge(order.id, 'Closed')}
                            className="flex-1 bg-red-800 hover:bg-red-900 text-white font-bold py-3 rounded-lg shadow transition">
                            🗑️ Delete & Close
                          </button>
                        </div>
                      </div>
                    </div>
                 </div>
               ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}