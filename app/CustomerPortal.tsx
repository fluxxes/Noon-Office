import React, { useState } from 'react';

const documentPrices: Record<string, number> = {
  'ID Card': 40,
  'Birth Certificate': 50,
  'University Certificate': 100,
  'Medical Report': 150,
  'Legal Contract': 200,
  'Other Document': 50,
};

export default function CustomerPortal({
  onOpenLogin,
  onSubmitOrder,
}: {
  onOpenLogin: () => void;
  onSubmitOrder: (order: any) => void;
}) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [docType, setDocType] = useState('ID Card');
  const [language, setLanguage] = useState('English to Arabic');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [wantsPrint, setWantsPrint] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [exactNames, setExactNames] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [referenceFile, setReferenceFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  let currentPrice = documentPrices[docType] || 50;
  if (language === 'Other (French, Spanish, etc.)') {
    currentPrice += 50;
  }

  const handleFileUpload = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleReferenceUpload = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setReferenceFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload the main document you want translated.');
      return;
    }

    setIsSubmitting(true);
    
    const newOrder = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      customer: customerName,
      phone: phoneNumber,
      type: docType,
      language: language,
      paymentMethod: paymentMethod,
      wantsPrint: wantsPrint,
      mainFileName: file.name,
      referenceFileName: referenceFile ? referenceFile.name : 'None provided',
      exactNamesProvided: exactNames,
      additionalNotes: additionalDetails,
      price: currentPrice,
      date: new Date().toISOString(), // Full ISO string for accurate reports
      status: 'Awaiting Translator',
      history: [
        {
          step: 'Order Received & Booked',
          timestamp: new Date().toLocaleString(),
          details: `Order submitted via Customer Portal. Paid ${currentPrice} SAR via ${paymentMethod}.`
        }
      ]
    };

    setTimeout(() => {
      onSubmitOrder(newOrder);
      alert(`Payment of ${currentPrice} SAR via ${paymentMethod} Successful! Your order #${newOrder.id} has been securely submitted to our translators.`);
      setIsSubmitting(false);
      
      setFile(null);
      setReferenceFile(null);
      setCustomerName('');
      setPhoneNumber('');
      setExactNames('');
      setAdditionalDetails('');
      setPaymentMethod('Card');
      e.target.reset();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="bg-white py-4 px-8 border-b shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-800 rounded flex items-center justify-center text-white font-bold italic border border-yellow-500">
            NO
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            NOON <span className="text-red-800">OFFICE</span>
          </h1>
        </div>
        <button onClick={onOpenLogin} className="text-sm font-bold text-gray-500 hover:text-red-800 transition">
          Staff Login
        </button>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto py-12 px-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 mb-3">
            Professional Document Translation
          </h2>
          <p className="text-gray-500 text-lg font-medium">
            Fast, certified, and fully secure cloud processing.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl border-t-4 border-t-red-800">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">
            Start Your Order
          </h2>
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">1. Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Full Name <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-red-800 outline-none transition bg-white"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Phone Number <span className="text-red-600">*</span></label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-red-800 outline-none transition bg-white"
                    placeholder="05XXXXXXXX"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">2. Document Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Document Type</label>
                  <select
                    className="w-full border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-red-800 bg-white font-medium text-gray-800"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                  >
                    <option value="ID Card">ID Card (40 SAR)</option>
                    <option value="Birth Certificate">Birth Certificate (50 SAR)</option>
                    <option value="University Certificate">University Certificate (100 SAR)</option>
                    <option value="Medical Report">Medical Report (150 SAR)</option>
                    <option value="Legal Contract">Legal Contract (200 SAR)</option>
                    <option value="Other Document">Other Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Translate To</label>
                  <select
                    className="w-full border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-red-800 bg-white font-medium text-gray-800"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English to Arabic">English to Arabic</option>
                    <option value="Arabic to English">Arabic to English</option>
                    <option value="Other (French, Spanish, etc.)">Other Language (+50 SAR)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2 uppercase tracking-wider text-sm">3. Ensure Perfect Accuracy (Optional)</h3>
              <p className="text-sm text-blue-700 mb-4">To ensure names are spelled exactly as they appear on your official records, please provide them below or upload an ID/Passport.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-blue-900">Exact Name Spellings (English/Arabic)</label>
                  <textarea 
                    rows={2}
                    value={exactNames}
                    onChange={(e) => setExactNames(e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg p-3 focus:border-blue-500 outline-none transition bg-white"
                    placeholder="e.g. My name in English must be spelled: Abdullah Al-Ghamdi"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-1 text-blue-900">Upload Reference ID/Passport (Image or PDF)</label>
                  <div className="relative border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-white hover:bg-blue-100 transition cursor-pointer">
                    <input type="file" accept=".pdf, image/*" onChange={handleReferenceUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    {referenceFile ? (
                      <span className="text-green-600 font-bold block">✅ Attached: {referenceFile.name}</span>
                    ) : (
                      <span className="text-blue-800 font-bold text-sm">Click to upload Passport or ID copy</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-black mb-2 text-gray-800 uppercase tracking-wide">
                4. Upload Document for Translation <span className="text-red-600">*</span>
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50 hover:bg-gray-100 hover:border-red-400 transition cursor-pointer">
                <input
                  type="file"
                  accept=".pdf, image/jpeg, image/png"
                  onChange={handleFileUpload}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {!file ? (
                  <>
                    <span className="text-4xl block mb-3">📄</span>
                    <span className="text-red-800 font-black block mb-2 text-xl">
                      Click to Select PDF or Image
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      Saved safely to temporary cloud storage.
                    </span>
                  </>
                ) : (
                  <span className="text-green-600 font-black block text-xl">
                    ✅ File Ready: {file.name}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">Any special requests or instructions for the translator?</label>
              <textarea 
                rows={3}
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-red-800 outline-none transition bg-white"
                placeholder="Type any extra notes here..."
              ></textarea>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between border border-gray-200 gap-4">
              <div className="w-full md:w-auto">
                <label className="block text-sm font-bold mb-2 text-gray-700">Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  className="w-full md:w-64 border-2 border-gray-300 rounded-lg p-2 outline-none focus:border-red-800 bg-white font-medium"
                >
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Cash">Cash (In-Office Only)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div>
                  <h4 className="font-bold text-gray-800">Physical Print Required?</h4>
                  <p className="text-xs text-gray-500">Go digital and receive a discount.</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={wantsPrint} onChange={(e) => setWantsPrint(e.target.checked)} />
                    <div className={`block w-14 h-8 rounded-full transition ${wantsPrint ? 'bg-red-800' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${wantsPrint ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl flex items-center justify-between border-2 border-yellow-400">
              <div>
                <h4 className="font-black text-yellow-900 uppercase tracking-widest text-sm mb-1">Total Order Price</h4>
                <p className="text-sm text-yellow-800 font-medium">Auto-calculated based on requirements.</p>
              </div>
              <div className="text-5xl font-black text-red-800">
                {currentPrice} <span className="text-xl">SAR</span>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-black disabled:bg-gray-400 text-white font-black py-6 rounded-xl shadow-lg transition text-xl uppercase tracking-widest"
            >
              {isSubmitting ? 'Processing Secure Payment...' : `Pay ${currentPrice} SAR & Submit Order`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
