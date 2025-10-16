'use client'

export default function DepreciationChart() {
  // Datos de ejemplo - en producción vendrían de la API
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const depreciationData = [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450]
  
  const maxValue = Math.max(...depreciationData) * 1.2

  return (
    <div className="w-full h-64">
      <div className="flex items-end justify-between h-full gap-2">
        {months.map((month, index) => {
          const height = (depreciationData[index] / maxValue) * 100
          
          return (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end h-full">
                <div 
                  className="w-full bg-gradient-to-t from-red-500 to-red-300 rounded-t-md transition-all hover:from-red-600 hover:to-red-400 cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {depreciationData[index].toFixed(2)}€
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600">{month}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Amortización mensual: <strong className="text-gray-800">450.00€</strong> • 
          Total anual: <strong className="text-gray-800">5,400.00€</strong>
        </p>
      </div>
    </div>
  )
}
