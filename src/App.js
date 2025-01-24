import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import SignaturePad from 'react-signature-canvas';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

function SignatureForm() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [wasteData, setWasteData] = useState(null);
  const [location, setLocation] = useState(null);
  const signaturePadRef = useRef();

  useEffect(() => {
    const fetchWasteData = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('waste_pick')
          .select(`
            id,
            quantity,
            unit,
            description,
            packaging_type,
            waste_code,
            status
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching waste pick data:', error);
          return;
        }

        if (data) {
          setWasteData(data);
          if (data.status === 'Terminé') {
            alert('Ce document est déjà terminé et ne peut plus être signé.');
          }
        }
      }
    };

    fetchWasteData();
  }, [id]);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (wasteData?.status === 'Terminé') {
      alert('Ce document est déjà terminé et ne peut plus être signé.');
      return;
    }

    if (wasteData?.status !== 'En cours') {
      alert('Ce document ne peut être signé que lorsque son statut est "En cours".');
      return;
    }

    if (!signaturePadRef.current.isEmpty()) {
      try {
        // Récupérer la position actuelle
        const position = await getLocation();
        
        const signatureData = signaturePadRef.current.toDataURL();
        const base64Data = signatureData.split(',')[1];
        const blob = await fetch(signatureData).then(res => res.blob());
        
        const bucketName = 'signatures/' + wasteData?.id;
        const { data: storageData, error: storageError } = await supabase.storage
          .from(bucketName)
          .upload('treatment_center', blob, {
            contentType: 'image/png',
            cacheControl: '3600'
          });

        if (storageError) throw storageError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl('treatment_center');

        // Créer le point POSTGIS
        const point = `POINT(${position.lng} ${position.lat})`;

        const { data, error } = await supabase
          .from('waste_pick')
          .update({
            treatment_center_signature: publicUrl,
            treatment_center_signed_at: new Date(),
            center_treatment_reponsible_name: name,
            center_treatment_email: email,
            treatment_center_signature_location: point,
            status: 'Terminé'
          })
          .eq('id', id);

        if (error) throw error;
        
        alert('Signature saved successfully!');
        setName('');
        setEmail('');
        signaturePadRef.current.clear();
        
        setWasteData(prev => ({
          ...prev,
          status: 'Terminé'
        }));
        
      } catch (error) {
        console.error('Error saving signature:', error);
        if (error.message.includes('Geolocation')) {
          alert('Impossible d\'obtenir votre position. Veuillez activer la géolocalisation.');
        } else {
          alert('Error saving signature');
        }
      }
    } else {
      alert('Please provide a signature');
    }
  };

  const clearSignature = () => {
    signaturePadRef.current.clear();
  };

  return (
    <div className="App">
      <div className="signature-container">
        <h1>Digital Signature Form</h1>
        
        {wasteData && (
          <div className="waste-info">
            <h2>Waste Information</h2>
            <div className="info-grid">
              {wasteData.waste_code && (
                <div className="info-item">
                  <strong>Waste Code:</strong> {wasteData.waste_code}
                </div>
              )}
              <div className="info-item">
                <strong>Quantity:</strong> {wasteData.quantity} {wasteData.unit}
              </div>
              {wasteData.packaging_type && (
                <div className="info-item">
                  <strong>Packaging Type:</strong> {wasteData.packaging_type}
                </div>
              )}
              {wasteData.description && (
                <div className="info-item">
                  <strong>Description:</strong> {wasteData.description}
                </div>
              )}
              <div className="info-item">
                <strong>Status:</strong> {wasteData.status}
              </div>
            </div>
          </div>
        )}
        
        {wasteData?.status === 'En cours' ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="signature-pad-container">
              <label>Signature:</label>
              <SignaturePad
                ref={signaturePadRef}
                canvasProps={{
                  className: 'signature-pad'
                }}
              />
              <button type="button" onClick={clearSignature}>Clear</button>
            </div>

            <button type="submit">Submit</button>
          </form>
        ) : (
          <div className="error-message">
            {wasteData?.status === 'Terminé' 
              ? 'Ce document est déjà terminé et ne peut plus être signé.'
              : 'Ce document ne peut être signé que lorsque son statut est "En cours".'
            }
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign/:id" element={<SignatureForm />} />
        <Route path="/sign" element={<SignatureForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
