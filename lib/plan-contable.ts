// Plan Contable General Simplificado para España
// Adaptado para centros ecuestres y actividades hípicas

export const planContable = {
  activo: {
    grupo2: {
      nombre: 'Inmovilizado',
      cuentas: [
        { code: '210', name: 'Terrenos y bienes naturales' },
        { code: '211', name: 'Construcciones' },
        { code: '212', name: 'Instalaciones técnicas' },
        { code: '213', name: 'Maquinaria' },
        { code: '214', name: 'Utillaje' },
        { code: '215', name: 'Otras instalaciones' },
        { code: '216', name: 'Mobiliario' },
        { code: '217', name: 'Equipos para procesos de información' },
        { code: '218', name: 'Elementos de transporte' },
        { code: '219', name: 'Otro inmovilizado material' },
      ]
    },
    grupo4: {
      nombre: 'Acreedores y Deudores',
      cuentas: [
        { code: '430', name: 'Clientes' },
        { code: '431', name: 'Clientes, efectos comerciales a cobrar' },
        { code: '440', name: 'Deudores' },
        { code: '470', name: 'Hacienda Pública, deudora por diversos conceptos' },
        { code: '472', name: 'Hacienda Pública, IVA soportado' },
        { code: '473', name: 'Hacienda Pública, retenciones y pagos a cuenta' },
      ]
    },
    grupo5: {
      nombre: 'Cuentas Financieras',
      cuentas: [
        { code: '570', name: 'Caja, euros' },
        { code: '572', name: 'Bancos e instituciones de crédito c/c vista, euros' },
      ]
    }
  },
  pasivo: {
    grupo1: {
      nombre: 'Financiación Básica',
      cuentas: [
        { code: '100', name: 'Capital social' },
        { code: '129', name: 'Resultado del ejercicio' },
      ]
    },
    grupo4: {
      nombre: 'Acreedores',
      cuentas: [
        { code: '400', name: 'Proveedores' },
        { code: '410', name: 'Acreedores por prestaciones de servicios' },
        { code: '475', name: 'Hacienda Pública, acreedora por conceptos fiscales' },
        { code: '477', name: 'Hacienda Pública, IVA repercutido' },
      ]
    }
  },
  ingresos: {
    grupo7: {
      nombre: 'Ventas e Ingresos',
      cuentas: [
        { code: '700', name: 'Ventas de mercaderías' },
        { code: '705', name: 'Prestaciones de servicios' },
        { code: '706', name: 'Descuentos sobre ventas por pronto pago' },
      ]
    }
  },
  gastos: {
    grupo6: {
      nombre: 'Compras y Gastos',
      cuentas: [
        { code: '600', name: 'Compras de mercaderías' },
        { code: '621', name: 'Arrendamientos y cánones' },
        { code: '622', name: 'Reparaciones y conservación' },
        { code: '623', name: 'Servicios de profesionales independientes' },
        { code: '624', name: 'Transportes' },
        { code: '625', name: 'Primas de seguros' },
        { code: '626', name: 'Servicios bancarios y similares' },
        { code: '627', name: 'Publicidad, propaganda y relaciones públicas' },
        { code: '628', name: 'Suministros' },
        { code: '629', name: 'Otros servicios' },
        { code: '640', name: 'Sueldos y salarios' },
        { code: '642', name: 'Seguridad Social a cargo de la empresa' },
        { code: '681', name: 'Amortización del inmovilizado material' },
      ]
    }
  }
}

// Cuentas específicas para actividades ecuestres
export const cuentasEquus = [
  { code: '705.1', name: 'Clases de equitación', grupo: 'Ingresos' },
  { code: '705.2', name: 'Pensión de caballos', grupo: 'Ingresos' },
  { code: '705.3', name: 'Alquiler de instalaciones', grupo: 'Ingresos' },
  { code: '705.4', name: 'Competiciones y eventos', grupo: 'Ingresos' },
  { code: '600.1', name: 'Compra de piensos y forrajes', grupo: 'Gastos' },
  { code: '600.2', name: 'Material hípico', grupo: 'Gastos' },
  { code: '623.1', name: 'Servicios veterinarios', grupo: 'Gastos' },
  { code: '623.2', name: 'Herraje', grupo: 'Gastos' },
  { code: '218.1', name: 'Remolques para caballos', grupo: 'Activo' },
  { code: '218.2', name: 'Vehículos todo terreno', grupo: 'Activo' },
  { code: '212.1', name: 'Cuadras y boxes', grupo: 'Activo' },
  { code: '212.2', name: 'Pistas de equitación', grupo: 'Activo' },
]

// Función helper para buscar cuentas
export function buscarCuenta(codigo: string) {
  // Implementación de búsqueda en el plan contable
  const todasLasCuentas = [
    ...Object.values(planContable.activo).flatMap(g => g.cuentas),
    ...Object.values(planContable.pasivo).flatMap(g => g.cuentas),
    ...planContable.ingresos.grupo7.cuentas,
    ...planContable.gastos.grupo6.cuentas,
    ...cuentasEquus
  ]
  
  return todasLasCuentas.find(c => c.code === codigo)
}

// Tipos de IVA en España
export const tiposIVA = [
  { rate: 0, label: 'Exento', code: 'E' },
  { rate: 4, label: 'Superreducido', code: 'SR' },
  { rate: 10, label: 'Reducido', code: 'R' },
  { rate: 21, label: 'General', code: 'G' },
]
