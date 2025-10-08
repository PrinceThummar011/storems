import { useState } from 'react';
import { Upload, FileText, X, Plus, Minus, Info } from 'lucide-react';
import { PrintOptions, PrintOrder } from '../types';
import { calculatePrintPrice, PRINT_PRICING } from '../utils/pricing';

interface PrintServiceProps {
  onAddToCart: (order: PrintOrder) => void;
}

export default function PrintService({ onAddToCart }: PrintServiceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const [options, setOptions] = useState<PrintOptions>({
    copies: 1,
    colorType: 'bw',
    sides: 'single',
    paperSize: 'A4'
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPageCount(Math.floor(Math.random() * 20) + 1);
    }
  };

  const price = file ? calculatePrintPrice(pageCount, options) : 0;

  const getBasePrice = () => {
    if (!file) return 0;
    return PRINT_PRICING[options.paperSize][options.colorType][options.sides];
  };

  const getTotalPages = () => {
    if (!file) return 0;
    return options.sides === 'double' ? Math.ceil(pageCount / 2) : pageCount;
  };

  const handleAddToCart = () => {
    if (file) {
      const printOrder: PrintOrder = {
        file,
        fileName: file.name,
        fileSize: file.size,
        pageCount,
        options,
        price
      };
      onAddToCart(printOrder);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFile(null);
      setOptions({
        copies: 1,
        colorType: 'bw',
        sides: 'single',
        paperSize: 'A4'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Print & Xerox Service</h2>
      <p className="text-gray-600 mb-8">Upload your PDF and customize your printing preferences</p>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Our Pricing</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Paper Size</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">B&W Single</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">B&W Double</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Color Single</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Color Double</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">A4</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.A4.bw.single}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.A4.bw.double}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.A4.color.single}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.A4.color.double}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">A3</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.A3.bw.single}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.A3.bw.double}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.A3.color.single}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.A3.color.double}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">Legal</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.Legal.bw.single}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.Legal.bw.double}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.Legal.color.single}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.Legal.color.double}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">Letter</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.Letter.bw.single}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.Letter.bw.double}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.Letter.color.single}</td>
                <td className="text-center py-3 px-4 text-gray-700">₹{PRINT_PRICING.Letter.color.double}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4">* Prices are per page. Double-sided printing counts as per physical page.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {!file ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Click to upload PDF
              </p>
              <p className="text-sm text-gray-500">
                or drag and drop your file here
              </p>
            </label>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024).toFixed(2)} KB • {pageCount} pages
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Copies
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setOptions({ ...options, copies: Math.max(1, options.copies - 1) })}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{options.copies}</span>
                  <button
                    onClick={() => setOptions({ ...options, copies: options.copies + 1 })}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paper Size
                </label>
                <select
                  value={options.paperSize}
                  onChange={(e) => setOptions({ ...options, paperSize: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="Legal">Legal</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOptions({ ...options, colorType: 'bw' })}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      options.colorType === 'bw'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Black & White
                  </button>
                  <button
                    onClick={() => setOptions({ ...options, colorType: 'color' })}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      options.colorType === 'color'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Color
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Print Sides
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOptions({ ...options, sides: 'single' })}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      options.sides === 'single'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Single-sided
                  </button>
                  <button
                    onClick={() => setOptions({ ...options, sides: 'double' })}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      options.sides === 'double'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Double-sided
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-600" />
                Price Breakdown
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Price per Page:</span>
                  <span className="font-medium text-gray-900">₹{getBasePrice()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Pages:</span>
                  <span className="font-medium text-gray-900">{pageCount} pages</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Copies:</span>
                  <span className="font-medium text-gray-900">{options.copies}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paper Size:</span>
                  <span className="font-medium text-gray-900">{options.paperSize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Print Type:</span>
                  <span className="font-medium text-gray-900">
                    {options.colorType === 'bw' ? 'Black & White' : 'Color'}, {options.sides === 'single' ? 'Single-sided' : 'Double-sided'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-semibold text-lg">Total Price:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{price}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Calculation: ₹{getBasePrice()} × {pageCount} pages × {options.copies} {options.copies > 1 ? 'copies' : 'copy'}
                </p>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-bounce">
          Print order added to cart!
        </div>
      )}
    </div>
  );
}
