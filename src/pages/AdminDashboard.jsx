import './AdminDashboard.css';

function AdminDashboard() {
  const reportes = [
    {
      id: 'IDXXXXXXX',
      tipo: 'LIMPIEZA Y AMBIENTE',
      ubicacion: 'Aula',
      urgencia: 'ALTA',
      trabajador: 'Trabajador 1',
      estatus: 'Trabajador llegó'
    }
  ];

  return (
    <div className="admin-dashboard-content">
      <div className="admin-dashboard-card">
        <h2 className="admin-dashboard-title">
          <span className="title-dashboard">DASHBOARD</span> DE REPORTES
        </h2>

        <div className="dashboard-table-container">
          <table className="dashboard-table">
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
                    <span className="trabajador-select">{reporte.trabajador} ▼</span>
                  </td>
                  <td>
                    <span className="estatus-badge estatus-trabajador-llego">{reporte.estatus}</span>
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

export default AdminDashboard;
