import './AdminReportes.css';

function AdminReportes() {
  const reportes = [
    {
      id: 'IDXXXXXXX',
      tipo: 'LIMPIEZA Y AMBIENTE',
      ubicacion: 'Aula',
      urgencia: 'ALTA',
      trabajador: 'Trabajador 1',
      estatus: 'Reporte Cerrado'
    }
  ];

  return (
    <div className="admin-reportes-content">
      <div className="admin-reportes-card">
        <h2 className="admin-reportes-title">
          <span className="title-historial">HISTORIAL</span> DE REPORTES
        </h2>

        <div className="reportes-table-container">
          <table className="reportes-table">
            <thead>
              <tr>
                <th>ID REPORTES</th>
                <th>TIPO DE INCIDENTE</th>
                <th>UBICACIÓN</th>
                <th>NIVEL DE URGENCIA</th>
                <th>TRABAJADOR</th>
                <th>ESTATUS</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte, index) => (
                <tr key={index}>
                  <td>{reporte.id}</td>
                  <td>{reporte.tipo}</td>
                  <td>{reporte.ubicacion}</td>
                  <td>
                    <span className="urgencia-badge urgencia-alta">{reporte.urgencia}</span>
                  </td>
                  <td>
                    <span className="trabajador-info">{reporte.trabajador} ▼</span>
                  </td>
                  <td>
                    <span className="estatus-badge estatus-cerrado">{reporte.estatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminReportes;
