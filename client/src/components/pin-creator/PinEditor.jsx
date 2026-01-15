import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { generatePinterestCaption, regenerateTitle, regenerateDescription } from '../../utils/pinterestCaptions';

// Pinterest pin dimensions (2:3 ratio)
const PIN_WIDTH = 500;
const PIN_HEIGHT = 750;

const FONT_OPTIONS = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Impact'
];

const SHAPE_COLORS = [
  '#ffffff', '#000000', '#ff6b6b', '#4ecdc4',
  '#ffe66d', '#95e1d3', '#dda0dd', '#ffa07a'
];

export default function PinEditor({
  aestheticImage,
  userImages,
  selectedText,
  aesthetic,
  inspirationImage,
  onBack,
  onReset
}) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(aestheticImage?.color || '#ffffff');
  const [showInspiration, setShowInspiration] = useState(!!inspirationImage);
  const [textSettings, setTextSettings] = useState({
    fontSize: 36,
    fontFamily: 'Arial',
    fill: '#ffffff',
    textAlign: 'center'
  });
  const [pinterestCaption, setPinterestCaption] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const bgColor = aestheticImage?.color || '#ffffff';
    setBackgroundColor(bgColor);

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: PIN_WIDTH,
      height: PIN_HEIGHT,
      backgroundColor: bgColor,
      selection: true
    });

    fabricRef.current = canvas;

    // Selection event handlers
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Load user images
    userImages.forEach((image, index) => {
      fabric.FabricImage.fromURL(image.processed, { crossOrigin: 'anonymous' }).then((img) => {
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        img.scale(scale);
        img.set({
          left: 100 + (index % 2) * 200,
          top: 200 + Math.floor(index / 2) * 150,
          originX: 'center',
          originY: 'center'
        });
        canvas.add(img);
        canvas.renderAll();
      });
    });

    // Add text if provided
    if (selectedText) {
      const text = new fabric.Textbox(selectedText, {
        left: PIN_WIDTH / 2,
        top: PIN_HEIGHT - 150,
        originX: 'center',
        originY: 'center',
        width: PIN_WIDTH - 80,
        fontSize: textSettings.fontSize,
        fontFamily: textSettings.fontFamily,
        fill: textSettings.fill,
        textAlign: textSettings.textAlign,
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.5)',
          blur: 4,
          offsetX: 2,
          offsetY: 2
        })
      });
      canvas.add(text);
      canvas.renderAll();
    }

    return () => {
      canvas.dispose();
    };
  }, [aestheticImage, userImages, selectedText]);

  // Update background color
  const updateBackgroundColor = (color) => {
    setBackgroundColor(color);
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.backgroundColor = color;
      canvas.renderAll();
    }
  };

  // Update text settings when selected
  const updateTextSettings = (key, value) => {
    setTextSettings(prev => ({ ...prev, [key]: value }));

    if (selectedObject && selectedObject.type === 'textbox') {
      selectedObject.set(key, value);
      fabricRef.current?.renderAll();
    }
  };

  // Update shape color
  const updateShapeColor = (color) => {
    if (selectedObject && (selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'triangle' || selectedObject.type === 'line')) {
      if (selectedObject.type === 'line') {
        selectedObject.set('stroke', color);
      } else {
        selectedObject.set('fill', color);
      }
      fabricRef.current?.renderAll();
    }
  };

  // Add shapes
  const addRectangle = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: PIN_WIDTH / 2,
      top: PIN_HEIGHT / 2,
      originX: 'center',
      originY: 'center',
      width: 150,
      height: 100,
      fill: '#4ecdc4',
      rx: 10,
      ry: 10
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const circle = new fabric.Circle({
      left: PIN_WIDTH / 2,
      top: PIN_HEIGHT / 2,
      originX: 'center',
      originY: 'center',
      radius: 60,
      fill: '#ff6b6b'
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addTriangle = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const triangle = new fabric.Triangle({
      left: PIN_WIDTH / 2,
      top: PIN_HEIGHT / 2,
      originX: 'center',
      originY: 'center',
      width: 120,
      height: 100,
      fill: '#ffe66d'
    });
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
  };

  const addLine = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const line = new fabric.Line([100, 100, 300, 100], {
      left: PIN_WIDTH / 2 - 100,
      top: PIN_HEIGHT / 2,
      stroke: '#000000',
      strokeWidth: 3
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  };

  // Add new text
  const addText = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const text = new fabric.Textbox('New Text', {
      left: PIN_WIDTH / 2,
      top: PIN_HEIGHT / 2,
      originX: 'center',
      originY: 'center',
      width: PIN_WIDTH - 80,
      fontSize: 36,
      fontFamily: 'Arial',
      fill: '#ffffff',
      textAlign: 'center',
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.5)',
        blur: 4,
        offsetX: 2,
        offsetY: 2
      })
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // Delete selected object
  const deleteSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas || !selectedObject) return;

    canvas.remove(selectedObject);
    setSelectedObject(null);
    canvas.renderAll();
  };

  // Bring forward / Send backward
  const bringForward = () => {
    const canvas = fabricRef.current;
    if (!canvas || !selectedObject) return;
    canvas.bringObjectForward(selectedObject);
    canvas.renderAll();
  };

  const sendBackward = () => {
    const canvas = fabricRef.current;
    if (!canvas || !selectedObject) return;
    canvas.sendObjectBackwards(selectedObject);
    canvas.renderAll();
  };

  // Export as PNG
  const exportPin = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Deselect all to remove selection handles
    canvas.discardActiveObject();
    canvas.renderAll();

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2 // Higher resolution export
    });

    const link = document.createElement('a');
    link.download = `pin-${aesthetic || 'custom'}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();

    // Generate Pinterest caption after export
    if (!pinterestCaption) {
      const caption = generatePinterestCaption(aesthetic || 'fashion');
      setPinterestCaption(caption);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Regenerate caption parts
  const handleRegenerateTitle = () => {
    if (pinterestCaption) {
      setPinterestCaption({
        ...pinterestCaption,
        title: regenerateTitle(aesthetic || 'fashion')
      });
    }
  };

  const handleRegenerateDescription = () => {
    if (pinterestCaption) {
      const newDesc = regenerateDescription();
      setPinterestCaption({
        ...pinterestCaption,
        description: newDesc
      });
    }
  };

  const isTextSelected = selectedObject?.type === 'textbox';
  const isShapeSelected = selectedObject && ['rect', 'circle', 'triangle', 'line'].includes(selectedObject.type);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Edit Your Pin</h3>
        <p className="text-gray-500 text-sm mb-4">
          Drag elements to reposition, resize, and customize your pin
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas and Inspiration Side by Side */}
        <div className="flex gap-4">
          {/* Canvas */}
          <div className="flex-shrink-0">
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg inline-block">
              <canvas ref={canvasRef} />
            </div>
          </div>

          {/* Inspiration Reference */}
          {inspirationImage && showInspiration && (
            <div className="flex-shrink-0">
              <div className="relative">
                <p className="text-sm font-medium text-gray-700 mb-2">Inspiration</p>
                <img
                  src={inspirationImage}
                  alt="Inspiration"
                  className="w-48 h-auto rounded-lg border border-gray-300 shadow-md"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
                <button
                  onClick={() => setShowInspiration(false)}
                  className="absolute top-0 right-0 mt-6 mr-1 w-6 h-6 bg-gray-800 text-white rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-4">
          {/* Background Color */}
          <div className="card p-4 space-y-3">
            <h4 className="font-medium text-gray-700">Background Color</h4>
            <div className="flex items-center gap-2">
              {SHAPE_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => updateBackgroundColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    backgroundColor === color ? 'scale-110 border-primary-600' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => updateBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Add Elements */}
          <div className="card p-4 space-y-3">
            <h4 className="font-medium text-gray-700">Add Elements</h4>
            <div className="flex flex-wrap gap-2">
              <button onClick={addText} className="btn-secondary text-sm px-3 py-2">
                + Text
              </button>
              <button onClick={addRectangle} className="btn-secondary text-sm px-3 py-2">
                ▢ Rectangle
              </button>
              <button onClick={addCircle} className="btn-secondary text-sm px-3 py-2">
                ● Circle
              </button>
              <button onClick={addTriangle} className="btn-secondary text-sm px-3 py-2">
                △ Triangle
              </button>
              <button onClick={addLine} className="btn-secondary text-sm px-3 py-2">
                — Line
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="card p-4 space-y-3">
            <h4 className="font-medium text-gray-700">Actions</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={deleteSelected}
                disabled={!selectedObject}
                className="btn-secondary text-sm px-3 py-2 text-red-600 disabled:opacity-50"
              >
                Delete
              </button>
              <button
                onClick={bringForward}
                disabled={!selectedObject}
                className="btn-secondary text-sm px-3 py-2 disabled:opacity-50"
              >
                ↑ Forward
              </button>
              <button
                onClick={sendBackward}
                disabled={!selectedObject}
                className="btn-secondary text-sm px-3 py-2 disabled:opacity-50"
              >
                ↓ Backward
              </button>
              {inspirationImage && !showInspiration && (
                <button
                  onClick={() => setShowInspiration(true)}
                  className="btn-secondary text-sm px-3 py-2"
                >
                  Show Inspiration
                </button>
              )}
            </div>
          </div>

          {/* Shape Settings */}
          {isShapeSelected && (
            <div className="card p-4 space-y-3">
              <h4 className="font-medium text-gray-700">Shape Color</h4>
              <div className="flex gap-2">
                {SHAPE_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => updateShapeColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      (selectedObject.fill === color || selectedObject.stroke === color)
                        ? 'scale-110 border-primary-600'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={selectedObject.fill || selectedObject.stroke || '#000000'}
                  onChange={(e) => updateShapeColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Text Settings */}
          {isTextSelected && (
            <div className="card p-4 space-y-3">
              <h4 className="font-medium text-gray-700">Text Settings</h4>

              {/* Font Family */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Font</label>
                <select
                  value={selectedObject.fontFamily}
                  onChange={(e) => updateTextSettings('fontFamily', e.target.value)}
                  className="input-field text-sm"
                >
                  {FONT_OPTIONS.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Size: {selectedObject.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={selectedObject.fontSize}
                  onChange={(e) => updateTextSettings('fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Color</label>
                <div className="flex gap-2">
                  {SHAPE_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => updateTextSettings('fill', color)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedObject.fill === color ? 'scale-110 border-primary-600' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={selectedObject.fill}
                    onChange={(e) => updateTextSettings('fill', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Text Align */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Alignment</label>
                <div className="flex gap-2">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => updateTextSettings('textAlign', align)}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedObject.textAlign === align
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click elements to select them</li>
              <li>• Drag corners to resize</li>
              <li>• Double-click text to edit</li>
              <li>• Use layer controls to adjust order</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pinterest Caption Generator */}
      {pinterestCaption && (
        <div className="card p-6 space-y-4 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📌</span>
            <h3 className="text-lg font-semibold text-red-700">Pinterest Caption Ready!</h3>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <div className="flex gap-2">
                <button
                  onClick={handleRegenerateTitle}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  ↻ Regenerate
                </button>
                <button
                  onClick={() => copyToClipboard(pinterestCaption.title, 'title')}
                  className="text-xs text-green-600 hover:text-green-700"
                >
                  {copiedField === 'title' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="font-medium text-gray-800">{pinterestCaption.title}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <div className="flex gap-2">
                <button
                  onClick={handleRegenerateDescription}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  ↻ Regenerate
                </button>
                <button
                  onClick={() => copyToClipboard(pinterestCaption.description, 'description')}
                  className="text-xs text-green-600 hover:text-green-700"
                >
                  {copiedField === 'description' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-800 whitespace-pre-wrap text-sm">{pinterestCaption.description}</p>
            </div>
          </div>

          {/* Copy All */}
          <button
            onClick={() => copyToClipboard(
              `${pinterestCaption.title}\n\n${pinterestCaption.description}`,
              'all'
            )}
            className="btn-primary w-full bg-red-600 hover:bg-red-700"
          >
            {copiedField === 'all' ? '✓ Copied Everything!' : 'Copy Title + Description'}
          </button>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button onClick={onReset} className="btn-secondary text-red-600">
          Start Over
        </button>
        <button onClick={exportPin} className="btn-primary flex-1">
          {pinterestCaption ? 'Download Again' : 'Download Pin'}
        </button>
      </div>
    </div>
  );
}
