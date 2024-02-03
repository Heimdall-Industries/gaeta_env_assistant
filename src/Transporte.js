import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faSave } from '@fortawesome/free-solid-svg-icons';
import staticData from './data';
import Swal from 'sweetalert2';

//; TAP = HS9HJAj3eR2wMD4bobtBrVdrxsppjobKXKbXBoC56Zks
//; TIP = 4groaMxw9yYWcrS9zGk84Z1gfvQrgt9Vmxqok4gq5NBC
//; TipSwei = 5LB5UgnbtvvWj9S43WRWUveWiyoroZBcgsjgBog9opcY

const Mineria = ({ title, content }) => {
    
  const [fleetInputs, setFleetInputs] = useState([
    {
      force_sub_warp: 'true'
    }
  ]);
  const [generatedScript, setGeneratedScript] = useState('');

  const addFleetInput = () => {
    if (staticData && staticData.length > 0) {
      const newFleet = {
        name: `FLOTA_${fleetInputs.length + 1}`,
        sector_start: staticData[0]['sector_name'], // Asegúrate de que staticData2 tenga datos
        resource_send: "", // Asegúrate de que staticData2 tenga datos
        sector_end: "", // Asegúrate de que staticData2 tenga datos
        resource_get: "", // Asegúrate de que staticData2 tenga datos
        force_sub_warp: "true",
        inputValue: '',
      };
      setFleetInputs([...fleetInputs, newFleet]);
    }
  };

  const handleFlotaChange = (flota, value, field) => {
    const updatedFleets = fleetInputs.map(fleet => {
      if (fleet.name === flota) {
        return { ...fleet, [field]: value };
      }
      return fleet;
    });
    setFleetInputs(updatedFleets);
  };

  const removeFleetInput = (flota) => {
    const updatedFleets = fleetInputs.filter(fleet => fleet.name !== flota);
    setFleetInputs(updatedFleets);
  };
  
  const duplicateFleet = (fleetName) => {
    const fleetToDuplicate = fleetInputs.find((fleet) => fleet.name === fleetName);

    if (fleetToDuplicate) {
      const newFleet = {
        name: `FLOTA_${fleetInputs.length + 1}`,
        sector_start: fleetToDuplicate.sector_start,
        resource_send: fleetToDuplicate.resource_send,
        sector_end: fleetToDuplicate.sector_end,
        resource_get: fleetToDuplicate.resource_get,
        force_sub_warp: fleetToDuplicate.force_sub_warp,
        inputValue: fleetToDuplicate.inputValue,
      };

      setFleetInputs([...fleetInputs, newFleet]);
    }
  };

  const generateScript = () => {
    if (fleetInputs.length > 0) {
      const script = fleetInputs.reduce(
        (acc, fleet, index) => {
          const sectorDataEnd = staticData.find(
            (row) => row['sector_end'] === fleet.sector
            );
          
          if (sectorDataEnd) {
            acc.SAGE_TRANSPORT_FORCE_SUB_WARP += `${fleet.force_sub_warp}${index < fleetInputs.length - 1 ? ',' : ''}`;
            acc.SAGE_TRANSPORT_STARTBASE_START += `${staticData.find(row => row['sector_name'] === fleet.sector_start)['sector_account']}${index < fleetInputs.length - 1 ? ',' : ''}`;
            acc.SAGE_TRANSPORT_STARTBASE_END += `${staticData.find(row => row['sector_name'] === fleet.sector_end)['sector_account']}${index < fleetInputs.length - 1 ? ',' : ''}`;
            
//            acc.SAGE_TRANSPORT_RESOURCES_START += `${staticData.find(row => row['resource_name'] === fleet.resource_send)['resource_account']}${index < fleetInputs.length - 1 ? ',' : ''}`;
            
            acc.SAGE_TRANSPORT_RESOURCES_START += `${fleet.resource_send ? staticData.find(row => row['resource_name'] === fleet.resource_send)['resource_account'] : ''}${index < fleetInputs.length - 1 ? ',' : ''}`;
            
            acc.SAGE_TRANSPORT_RESOURCES_END += `${staticData.find(row => row['resource_name'] === fleet.resource_get)['resource_account']}${index < fleetInputs.length - 1 ? ',' : ''}`;
            acc.SAGE_TRANSPORT_FLEET += `${fleet.inputValue}${index < fleetInputs.length - 1 ? ',' : ''}`;
            
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `There is no END sector selected for the ${fleet.name}`,
            });
            console.error(`There is no END sector selected for the $ ${fleet.name}`);
            // Puedes mostrar un mensaje de error o simplemente ignorar esta flota
            return false;
          }
          
          return acc;
          
          
        },
        {
          SAGE_TRANSPORT_FORCE_SUB_WARP: '',
          SAGE_TRANSPORT_STARTBASE_START: '',
          SAGE_TRANSPORT_STARTBASE_END: '',
          
          SAGE_TRANSPORT_RESOURCES_START: '',
          SAGE_TRANSPORT_RESOURCES_END: '',
          SAGE_TRANSPORT_FLEET: '',
        }
      );

      const finalScript = `
SAGE_TRANSPORT_ENABLE=true
SAGE_TRANSPORT_LOOP_COUNTER=
SAGE_TRANSPORT_FORCE_SUB_WARP=${script.SAGE_TRANSPORT_FORCE_SUB_WARP}      
SAGE_TRANSPORT_STARTBASE_START=${script.SAGE_TRANSPORT_STARTBASE_START}      
SAGE_TRANSPORT_STARTBASE_END=${script.SAGE_TRANSPORT_STARTBASE_END}
SAGE_TRANSPORT_RESOURCES_END_NO_REFUEL=true
SAGE_TRANSPORT_RESOURCES_START=${script.SAGE_TRANSPORT_RESOURCES_START}
SAGE_TRANSPORT_RESOURCES_END=${script.SAGE_TRANSPORT_RESOURCES_END}
SAGE_TRANSPORT_FLEET=${script.SAGE_TRANSPORT_FLEET}
    `;
//      Swal.fire({
//        icon: 'success',
//        title: 'Script de Mineria Creado',
//        text: `${finalScript}`,
//      });
      
      setGeneratedScript(finalScript);
    }
  };

  const copyToClipboard = () => {
    const textArea = document.createElement('textarea');
    textArea.value = generatedScript;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    document.body.removeChild(textArea);
  };

  const saveToFile = () => {
    const blob = new Blob([generatedScript], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'mining_script.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboardWallet = (text) => {
    navigator.clipboard.writeText(text);
  };
  

  const HouseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
    </svg>
    );
  
    return (
      
      
      
      
      <div className="container mt-4">

        <div>
          <h2>Transport env:</h2>
          <button className="btn btn-primary mb-2" onClick={addFleetInput}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
            &nbsp;&nbsp;Add &nbsp;
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-airplane" viewBox="0 0 16 16">
              <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849m.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1s-.458.158-.678.599"/>
            </svg>
          </button>
          {fleetInputs.map(fleet => (
            <div key={fleet.name} className="mb-3 d-flex flex-column align-items-start card">
              
              <div class="container card-body">
                <div class="row">
                  <div class="col col-lg-6">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Fleet id:</span>
                      </div>
                      <input
                        type="text"
                        className="form-control me-2 mb-2 input-box"
                        placeholder={`Ingrese valor para ${fleet.name}`}
                        value={fleet.inputValue}
                        onChange={(e) =>
        handleFlotaChange(fleet.name, e.target.value, 'inputValue')
      }
                      />
                    </div>
                  </div>
                  <div class="col">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Force Sub Warp:</span>
                      </div>
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        id={`checkbox-${fleet.name}`}
                        checked={fleet.force_sub_warp}  // Assuming you have a isChecked property in your fleet object
                        onChange={(e) =>
        handleFlotaChange(fleet.name, e.target.checked, 'force_sub_warp')
      }
                      />
                    </div>
                    
                  </div>
                  <div class="col">
                    <div className="d-flex align-items-center">

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFleetInput(fleet.name)}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                        </svg>
                        &nbsp; del &nbsp;
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-airplane" viewBox="0 0 16 16">
                          <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849m.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1s-.458.158-.678.599"/>
                        </svg>
                      </button>
                      
                      <button className="btn btn-info btn-sm" onClick={() => duplicateFleet(fleet.name)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                        </svg>
                        &nbsp; clone &nbsp;
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-airplane" viewBox="0 0 16 16">
                          <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849m.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1s-.458.158-.678.599"/>
                        </svg>
                      </button>
                    </div>

                  </div>
                  
                  
                  
                </div>
                <div class="row">
                  <div class="col">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">SB START
                        </span>
                      </div>
                      <select
                        className="form-select me-2 mb-2"
                        value={fleet.sector_start}
                        onChange={(e) =>
        handleFlotaChange(fleet.name, e.target.value, 'sector_start')
      }
                        >
                        <option value="">Selecciona un sector</option>
                        {staticData.map((row) => (
                          <option
                            key={row['sector_name']}
                            value={row['sector_name']}
                            >
                            {row['sector_name']}
                          </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div class="col">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">SEND resource:</span>
                      </div>
                      <select
                        className="form-select me-2 mb-2"
                        value={fleet.resource_send}
                        onChange={(e) =>
        handleFlotaChange(fleet.name, e.target.value, 'resource_send')
      }
                        >
                        <option value="">Select a Resource to send</option>
                        {staticData.map((row) => (
                          <option
                            key={row['resource_name']}
                            value={row['resource_name']}
                            >
                            {row['resource_name']}
                          </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">SB END</span>
                      </div>
                      <select
                        className="form-select me-2 mb-2"
                        value={fleet.sector_end}
                        onChange={(e) =>
        handleFlotaChange(fleet.name, e.target.value, 'sector_end')
      }
                        >
                        <option value="">Selecciona un sector</option>
                        {staticData.map((row) => (
                          <option
                            key={row['sector_name']}
                            value={row['sector_name']}
                            >
                            {row['sector_name']}
                          </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div class="col">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">GET resource:</span>
                      </div>
                      <select
                        className="form-select me-2 mb-2"
                        value={fleet.resource_get}
                        onChange={(e) =>
        handleFlotaChange(fleet.name, e.target.value, 'resource_get')
      }
                        >
                        <option value="">Select a Resource to send</option>
                        {staticData.map((row) => (
                          <option
                            key={row['resource_name']}
                            value={row['resource_name']}
                            >
                            {row['resource_name']}
                          </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>               
              </div>
              
              
            </div>


            ))}
        </div>

        <button className="btn btn-success" onClick={generateScript}>Generar Script Transporte</button>

        {generatedScript && (
          <div className="mt-3">
            <h2>Script generado:</h2>
            <textarea
              className="form-control mb-2 generated-script"
              value={generatedScript}
              readOnly
              rows="10"
              style={{ fontSize: '14px', overflowY: 'auto'}} 
            />
            <button className="btn btn-primary" onClick={copyToClipboard}>
              <FontAwesomeIcon icon={faCopy} /> Copiar
            </button>

          </div>
          )}
      </div>
     
        );
};

export default Mineria;