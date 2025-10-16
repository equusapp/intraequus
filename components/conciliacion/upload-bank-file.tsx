'use client'

import { useState } from 'react'
import { X, Upload, FileText, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface UploadBankFileProps {
  onClose: () => void
}

export default function UploadBankFile({ onClose }: UploadBankFileProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    // Simular upload
    setTimeout(() => {
      setUploading(false)
      setUploaded(true)
      // Aquí iría el procesamiento del archivo CSV/OFX con papaparse
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white rounded-lg max-w-2xl w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Subir Extracto Bancario</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        {!uploaded ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Sube un archivo en formato CSV o OFX desde tu banco
              </p>
            </div>

            {/* Upload Area */}
            <div>
              <label className="flex flex-col items-center justify-center w-full h-64 px-4 border-2 border-dashed border-equus-sand rounded-lg cursor-pointer hover:bg-equus-beige/30 transition-colors">
                <div className="space-y-3 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  {file ? (
                    <div className="flex items-center gap-2 text-equus-blue-soft">
                      <FileText className="h-5 w-5" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-lg font-medium text-gray-700">
                        Haz clic o arrastra el archivo aquí
                      </div>
                      <div className="text-sm text-gray-500">
                        Formatos aceptados: CSV, OFX (máx. 10MB)
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.ofx"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Instructions */}
            <div className="bg-equus-cream border border-equus-sand rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Instrucciones:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>1. Descarga el extracto bancario desde tu banco online</li>
                <li>2. Selecciona formato CSV o OFX</li>
                <li>3. Sube el archivo y el sistema procesará los movimientos</li>
                <li>4. Revisa y concilia cada movimiento con tus facturas</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!file || uploading}
              >
                {uploading ? 'Procesando...' : 'Subir y Procesar'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ¡Archivo Procesado!
            </h3>
            <p className="text-gray-600 mb-6">
              Se han importado 24 movimientos bancarios
            </p>
            <Button onClick={onClose}>
              Ver Movimientos
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
