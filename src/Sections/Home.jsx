import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Plus, Trash2, Download, FolderOpen, 
  Search, Building2, Save, X, Eye, Paperclip, 
  ArrowUpCircle, ArrowDownCircle, FileJson, FileSpreadsheet, 
  FileDown, BarChart3, Calendar, FilePlus
} from "lucide-react";

// PDF & Chart Libraries
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DEFAULT_CATEGORIES = [
  "Mess expenses", 
  "Salary", 
  "EVENT(Event expenses,Event day fuel,Event day fooding,Event other expenses)", 
  "Fuel on normal day", 
  "OFFICE(staionary,electric,recharges,rent,furniture,gadets)", 
  "Other office expenses(recreational,birthdays,parties,puja etc)",
  "CREDIT"
];

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [categories] = useState(DEFAULT_CATEGORIES);
  const [activeFileName, setActiveFileName] = useState("company_ledger_2026");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null); 
  const [tempFileName, setTempFileName] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf"); 
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    description: "", amount: "", category: "Salary", 
    date: new Date().toISOString().split('T')[0],
    fromWhom: "", toWhom: "", billPhoto: "",
    type: "debit" 
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    const saved = localStorage.getItem("corp_ledger_v5");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setExpenses(parsed.expenses || []);
      } catch (e) { console.error("Local storage sync error"); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("corp_ledger_v5", JSON.stringify({ expenses, categories }));
  }, [expenses, categories]);

  // --- ACTIONS ---
  const handleNewFile = () => {
    const confirmNew = window.confirm("Create a new ledger? This will clear the current screen. Ensure you have exported your data if needed.");
    if (confirmNew) {
      setExpenses([]);
      setActiveFileName("new_ledger_2026");
      setForm({
        description: "", amount: "", category: "Salary", 
        date: new Date().toISOString().split('T')[0],
        fromWhom: "", toWhom: "", billPhoto: "",
        type: "debit" 
      });
    }
  };

  // --- CALCULATIONS ---
  const totalDebit = expenses.filter(e => e.type === 'debit').reduce((sum, e) => sum + Number(e.amount), 0);
  const totalCredit = expenses.filter(e => e.type === 'credit').reduce((sum, e) => sum + Number(e.amount), 0);

  const chartData = useMemo(() => {
    const dataMap = expenses
      .filter(e => e.type === 'debit')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
        return acc;
      }, {});

    return Object.keys(dataMap).map(cat => ({
      name: cat,
      amount: dataMap[cat]
    })).sort((a, b) => b.amount - a.amount).slice(0, 5); 
  }, [expenses]);

  // --- PDF GENERATOR ---
  const generatePDF = (fileName) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(0, 48, 135); 
    doc.text("CORPORATE LEDGER REPORT", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    doc.setFillColor(245, 247, 250);
    doc.roundedRect(14, 40, 182, 20, 2, 2, "F");
    doc.setTextColor(0);
    doc.text(`Total Credit: INR ${totalCredit.toLocaleString()}`, 20, 52);
    doc.text(`Total Debit: INR ${totalDebit.toLocaleString()}`, 80, 52);
    doc.text(`Net Balance: INR ${(totalCredit - totalDebit).toLocaleString()}`, 140, 52);

    const tableRows = expenses.map(e => [
      e.date,
      e.type.toUpperCase(),
      e.description,
      e.category,
      `INR ${Number(e.amount).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Date', 'Type', 'Description', 'Category', 'Amount']],
      body: tableRows,
      headStyles: { fillColor: [0, 112, 186] },
    });

    return doc.output('blob');
  };

  // --- EXPORT ENGINE ---
  const handleExport = async () => {
    const fileName = tempFileName || activeFileName;
    let contentBlob;
    let extension = exportFormat;
    let mimeType = "";

    if (exportFormat === "pdf") {
      contentBlob = generatePDF(fileName);
      mimeType = "application/pdf";
    } else if (exportFormat === "json") {
      const data = JSON.stringify({ expenses, categories }, null, 2);
      contentBlob = new Blob([data], { type: "application/json" });
      mimeType = "application/json";
    } else if (exportFormat === "csv") {
      const headers = "Date,Type,Description,Amount,Category,From,To\n";
      const rows = expenses.map(e => `"${e.date}","${e.type}","${e.description}","${e.amount}","${e.category}","${e.fromWhom}","${e.toWhom}"`).join("\n");
      contentBlob = new Blob([headers + rows], { type: "text/csv" });
      mimeType = "text/csv";
    }

    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: `${fileName}.${extension}`,
          types: [{ description: `${exportFormat.toUpperCase()} File`, accept: { [mimeType]: [`.${extension}`] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(contentBlob);
        await writable.close();
        setShowSaveModal(false);
        setActiveFileName(fileName);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    const url = URL.createObjectURL(contentBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${extension}`;
    link.click();
    setShowSaveModal(false);
    setActiveFileName(fileName);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2000000) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, billPhoto: reader.result });
      reader.readAsDataURL(file);
    } else { alert("Image too large (Max 2MB)"); }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] font-sans text-[#2c2e2f] pb-20">
      {/* BILL PREVIEW MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedBill(null)}>
          <button className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full"><X size={32}/></button>
          <img src={selectedBill} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" alt="Receipt" />
        </div>
      )}

      {/* SAVE MODAL */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-[#001c64]/40 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-black mb-6 text-[#003087] flex items-center gap-2"><Download size={20}/> Save Ledger</h3>
              
              <label className="text-[10px] font-black uppercase text-[#9ca3af] mb-2 block">New File Name</label>
              <input className="w-full bg-[#f5f7fa] border border-[#e5e7eb] p-4 rounded-2xl outline-none mb-6 font-bold focus:border-[#0070ba]"
                value={tempFileName} placeholder="e.g. Office_Ledger_Jan" onChange={(e) => setTempFileName(e.target.value)} />

              <label className="text-[10px] font-black uppercase text-[#9ca3af] mb-2 block">Choose Format</label>
              <div className="grid grid-cols-3 gap-3 mb-8">
                 <button onClick={() => setExportFormat("pdf")} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${exportFormat === 'pdf' ? 'border-red-500 bg-red-50' : 'border-transparent bg-[#f5f7fa]'}`}>
                   <FileDown className="text-red-500" size={18}/> <span className="text-[10px] font-bold">PDF</span>
                 </button>
                 <button onClick={() => setExportFormat("csv")} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${exportFormat === 'csv' ? 'border-green-600 bg-green-50' : 'border-transparent bg-[#f5f7fa]'}`}>
                   <FileSpreadsheet className="text-green-600" size={18}/> <span className="text-[10px] font-bold">CSV</span>
                 </button>
                 <button onClick={() => setExportFormat("json")} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${exportFormat === 'json' ? 'border-[#0070ba] bg-blue-50' : 'border-transparent bg-[#f5f7fa]'}`}>
                   <FileJson className="text-blue-500" size={18}/> <span className="text-[10px] font-bold">JSON</span>
                 </button>
              </div>

              <button onClick={handleExport} className="w-full py-4 bg-[#003087] text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-[#002169]">
                <Save size={18}/> Select Save Location
              </button>
              <button onClick={() => setShowSaveModal(false)} className="w-full mt-4 text-[#6b7280] font-bold text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white border-b border-[#e5e7eb] px-6 py-4 mb-8 sticky top-0 z-40 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#003087] p-2 rounded-xl text-white"><Building2 size={24}/></div>
          <h1 className="text-2xl font-black italic text-[#6e6e6e]">EX<span className="text-[#e36f09]">SPOT</span></h1>
        </div>
        <div className="flex gap-2">
          {/* NEW BUTTON */}
          <button onClick={handleNewFile} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full font-bold text-sm transition-colors">
            <Plus size={16}/> New
          </button>
          
          <input type="file" ref={fileInputRef} onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
              try {
                const data = JSON.parse(event.target.result);
                setExpenses(data.expenses || []);
                setActiveFileName(file.name.replace(".json", ""));
              } catch (err) { alert("Error loading file"); }
            };
            reader.readAsText(file);
          }} className="hidden" accept=".json" />
          
          <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#0070ba] text-[#0070ba] rounded-full font-bold text-sm hover:bg-blue-50 transition-colors">
            <FolderOpen size={16}/> Load
          </button>
          
          <button onClick={() => { setTempFileName(activeFileName); setShowSaveModal(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#0070ba] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#005a9e] transition-colors">
            <Download size={16}/> Export
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[2rem] p-5 border border-[#e5e7eb] relative overflow-hidden">
              <p className="text-[#6b7280] font-bold text-[10px] uppercase mb-1">Total Credit</p>
              <h2 className="text-xl font-black text-green-600">₹{totalCredit.toLocaleString()}</h2>
              <ArrowUpCircle className="absolute -bottom-2 -right-2 opacity-5 text-green-600" size={60}/>
            </div>
            <div className="bg-white rounded-[2rem] p-5 border border-[#e5e7eb] relative overflow-hidden">
              <p className="text-[#6b7280] font-bold text-[10px] uppercase mb-1">Total Debit</p>
              <h2 className="text-xl font-black text-red-600">₹{totalDebit.toLocaleString()}</h2>
              <ArrowDownCircle className="absolute -bottom-2 -right-2 opacity-5 text-red-600" size={60}/>
            </div>
          </div>

          {/* GRAPH */}
          <div className="bg-white rounded-[2.5rem] p-6 border border-[#e5e7eb] shadow-sm">
            <h3 className="font-bold text-[#003087] text-sm mb-4 flex items-center gap-2"><BarChart3 size={16}/> Top Spending Categories</h3>
            <div className="h-48 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f5f7fa'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                    <Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={30}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#0070ba'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">Add debits to see chart</div>
              )}
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-[2.5rem] p-6 border border-[#e5e7eb] shadow-sm space-y-4">
            <h3 className="font-bold text-[#003087]">New Transaction</h3>
            <div className="flex bg-[#f5f7fa] p-1 rounded-xl">
              <button onClick={() => setForm({...form, type: 'debit'})} className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${form.type === 'debit' ? 'bg-red-500 text-white shadow-md' : 'text-[#6b7280]'}`}>DEBIT</button>
              <button onClick={() => setForm({...form, type: 'credit'})} className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${form.type === 'credit' ? 'bg-green-500 text-white shadow-md' : 'text-[#6b7280]'}`}>CREDIT</button>
            </div>
            <input placeholder="Description" className="w-full p-4 bg-[#f5f7fa] border border-[#e5e7eb] rounded-2xl outline-none focus:border-[#0070ba]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <div className="grid grid-cols-2 gap-3">
               <input placeholder="Sender" className="p-3 bg-[#f5f7fa] border border-[#e5e7eb] rounded-xl text-sm" value={form.fromWhom} onChange={e => setForm({...form, fromWhom: e.target.value})} />
               <input placeholder="Receiver" className="p-3 bg-[#f5f7fa] border border-[#e5e7eb] rounded-xl text-sm" value={form.toWhom} onChange={e => setForm({...form, toWhom: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Amount" className="p-3 bg-[#f5f7fa] border border-[#e5e7eb] rounded-xl font-bold" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
              <select className="p-3 bg-[#f5f7fa] border border-[#e5e7eb] rounded-xl text-xs font-bold" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <input type="date" className="w-full p-3 bg-[#f5f7fa] border border-[#e5e7eb] rounded-xl text-xs font-bold" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <label className="flex items-center justify-center gap-2 w-full p-4 bg-[#f0f7fd] text-[#0070ba] border-2 border-dashed border-[#0070ba]/30 rounded-2xl cursor-pointer font-bold text-xs uppercase">
              <Paperclip size={16}/> {form.billPhoto ? "Proof Attached ✅" : "Attach Receipt"}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <button onClick={() => {
              if(!form.description || !form.amount) return alert("Fill required fields");
              setExpenses([{...form, id: Date.now(), amount: Number(form.amount)}, ...expenses]);
              setForm({...form, description: "", amount: "", fromWhom: "", toWhom: "", billPhoto: ""});
            }} className={`w-full py-4 text-white rounded-full font-bold shadow-lg transition-all ${form.type === 'credit' ? 'bg-green-600' : 'bg-red-500'}`}>
              Save {form.type.toUpperCase()}
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#f5f7fa] flex items-center gap-4 bg-[#fcfdfe]">
              <Search className="text-[#9ca3af]" size={20} />
              <input placeholder="Search transactions..." className="bg-transparent outline-none w-full font-medium text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="max-h-[850px] overflow-y-auto p-4">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <tbody>
                  {expenses.filter(e => e.description.toLowerCase().includes(searchTerm.toLowerCase())).map(e => (
                    <tr key={e.id} className="bg-white hover:shadow-sm transition-all">
                      <td className="px-5 py-4 rounded-l-2xl border-y border-l border-[#f1f5f9]">
                        <div className="font-bold text-sm text-[#003087]">{e.description}</div>
                        <div className="text-[10px] text-[#6b7280] font-bold mt-1 uppercase flex items-center gap-2">
                           <Calendar size={10}/> {e.date} | {e.fromWhom} → {e.toWhom}
                        </div>
                      </td>
                      <td className="px-5 py-4 border-y border-[#f1f5f9] text-right">
                        <div className={`font-black text-md ${e.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                          {e.type === 'credit' ? '+' : '-'}₹{Number(e.amount).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#0070ba] font-bold uppercase">{e.category}</div>
                      </td>
                      <td className="px-5 py-4 rounded-r-2xl border-y border-r border-[#f1f5f9] text-right space-x-1">
                        {e.billPhoto && <button onClick={() => setSelectedBill(e.billPhoto)} className="p-2 text-[#0070ba] hover:bg-blue-50 rounded-full"><Eye size={18}/></button>}
                        <button onClick={() => setExpenses(expenses.filter(i => i.id !== e.id))} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {expenses.length === 0 && <div className="text-center py-20 text-gray-400 italic font-medium">No records found. Start adding transactions.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}