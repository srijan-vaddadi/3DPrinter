'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const materials = [
  { name: 'PLA', price: 0.04 },
  { name: 'PETG', price: 0.06 },
  { name: 'Resin', price: 0.12 },
  { name: 'Nylon', price: 0.1 },
  { name: 'ABS', price: 0.05 },
  { name: 'TPU', price: 0.08 },
];

const colors = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#1e1e2e' },
  { name: 'Red', value: '#e74c3c' },
  { name: 'Blue', value: '#3498db' },
  { name: 'Green', value: '#2ecc71' },
  { name: 'Yellow', value: '#f1c40f' },
  { name: 'Purple', value: '#6c5ce7' },
  { name: 'Orange', value: '#e67e22' },
];

const qualities = [
  { name: 'Draft', layer: '0.3mm', desc: 'Fast, visible layers' },
  { name: 'Standard', layer: '0.2mm', desc: 'Balanced quality' },
  { name: 'High', layer: '0.1mm', desc: 'Smooth finish' },
  { name: 'Ultra', layer: '0.05mm', desc: 'Maximum detail' },
];

const infillOptions = ['10%', '20%', '50%', '100%'];

export default function CustomPage() {
  const [selectedMaterial, setSelectedMaterial] = useState('PLA');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedQuality, setSelectedQuality] = useState('Standard');
  const [selectedInfill, setSelectedInfill] = useState('20%');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; url: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) { setUploadError(data.error); return; }
      setUploadedFile({ name: data.fileName, size: data.size, url: data.url });
    } catch { setUploadError('Upload failed. Please try again.'); }
    finally { setUploading(false); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <>
      <Navbar />
      <PageHeader title="Custom Order" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Custom Order' }]} />

      <main className="bg-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Upload & Preview */}
            <div className="space-y-6">
              {/* Upload Area */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl,.obj,.3mf,.step,.stp"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-dark font-semibold">Uploading...</p>
                    </>
                  ) : uploadedFile ? (
                    <>
                      <div className="text-5xl mb-4">✅</div>
                      <h3 className="text-lg font-semibold text-dark mb-1">{uploadedFile.name}</h3>
                      <p className="text-gray text-sm">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB uploaded</p>
                      <p className="text-primary text-sm mt-2 font-medium">Click to replace</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-16 h-16 text-gray mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <h3 className="text-lg font-semibold text-dark mb-2">Upload Your 3D Model</h3>
                      <p className="text-gray text-sm">Drag & drop or click to browse</p>
                      <p className="text-gray text-xs mt-1">STL, OBJ, 3MF, STEP &middot; Max 100MB</p>
                    </>
                  )}
                </div>
                {uploadError && <p className="text-red-500 text-sm mt-3">{uploadError}</p>}
              </div>

              {/* Preview Box */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-dark mb-4">Model Preview</h3>
                <div className="bg-dark rounded-xl h-72 flex items-center justify-center relative">
                  <span className="text-6xl animate-spin" style={{ animationDuration: '8s' }}>
                    📦
                  </span>
                </div>
                <div className="flex justify-center gap-3 mt-4">
                  <button className="px-4 py-2 bg-dark-light text-white rounded-lg text-sm hover:bg-primary transition-colors">
                    Rotate
                  </button>
                  <button className="px-4 py-2 bg-dark-light text-white rounded-lg text-sm hover:bg-primary transition-colors">
                    Zoom In
                  </button>
                  <button className="px-4 py-2 bg-dark-light text-white rounded-lg text-sm hover:bg-primary transition-colors">
                    Zoom Out
                  </button>
                  <button className="px-4 py-2 bg-dark-light text-white rounded-lg text-sm hover:bg-primary transition-colors">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Configuration Form */}
            <div className="space-y-6">
              {/* Project Name */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold text-dark mb-4">Project Details</h3>
                <label htmlFor="projectName" className="block text-sm font-medium text-dark mb-1">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="My Custom Print"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              {/* Material Selection */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold text-dark mb-4">Material</h3>
                <div className="grid grid-cols-3 gap-3">
                  {materials.map((mat) => (
                    <button
                      key={mat.name}
                      onClick={() => setSelectedMaterial(mat.name)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        selectedMaterial === mat.name
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/30'
                      }`}
                    >
                      <span className="block font-semibold text-dark text-sm">{mat.name}</span>
                      <span className="block text-xs text-gray mt-1">
                        ${mat.price.toFixed(2)}/cm&sup3;
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold text-dark mb-4">Color</h3>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.value
                          ? 'border-primary scale-110 ring-2 ring-primary/30'
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Print Quality */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold text-dark mb-4">Print Quality</h3>
                <div className="grid grid-cols-2 gap-3">
                  {qualities.map((q) => (
                    <button
                      key={q.name}
                      onClick={() => setSelectedQuality(q.name)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedQuality === q.name
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/30'
                      }`}
                    >
                      <span className="block font-semibold text-dark text-sm">{q.name}</span>
                      <span className="block text-xs text-gray">{q.layer} - {q.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale & Infill */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-dark mb-4">Scale</h3>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-white">
                      <option value="50">50%</option>
                      <option value="75">75%</option>
                      <option value="100" selected>100% (Original)</option>
                      <option value="150">150%</option>
                      <option value="200">200%</option>
                      <option value="300">300%</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-4">Infill Density</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {infillOptions.map((inf) => (
                        <button
                          key={inf}
                          onClick={() => setSelectedInfill(inf)}
                          className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedInfill === inf
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 text-dark hover:border-primary/30'
                          }`}
                        >
                          {inf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity & Notes */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-dark mb-1">
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      defaultValue={1}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <label htmlFor="notes" className="block text-sm font-medium text-dark mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Any special requirements or instructions..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Price Estimate */}
              <div className="bg-dark rounded-2xl p-8 text-white">
                <h3 className="font-semibold mb-4">Price Estimate</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model Volume</span>
                    <span className="text-gray-400">Upload to calculate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Material Cost</span>
                    <span className="text-gray-400">Upload to calculate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Print Time</span>
                    <span className="text-gray-400">Upload to calculate</span>
                  </div>
                  <div className="h-px bg-dark-light" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-accent">Upload to calculate</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl transition-colors">
                  Get Quote
                </button>
                <button className="flex-1 bg-accent hover:bg-accent/90 text-dark font-semibold py-4 rounded-xl transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-dark text-center mb-10">Design Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="text-4xl mb-4">📐</div>
                <h3 className="font-semibold text-dark mb-2">Max Dimensions</h3>
                <p className="text-sm text-gray">
                  Build volume up to 300 x 300 x 400mm. Contact us for larger prints.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="text-4xl mb-4">📏</div>
                <h3 className="font-semibold text-dark mb-2">Wall Thickness</h3>
                <p className="text-sm text-gray">
                  Minimum wall thickness of 1.2mm for FDM, 0.5mm for resin prints.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-semibold text-dark mb-2">Detail Level</h3>
                <p className="text-sm text-gray">
                  Minimum feature size of 0.8mm for FDM, 0.2mm for resin prints.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-semibold text-dark mb-2">Need Help?</h3>
                <p className="text-sm text-gray">
                  Our design team can optimize your model for the best print results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
