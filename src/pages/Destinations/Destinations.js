import React from 'react';
import { Link } from 'react-router-dom';
import './Destinations.css'; 
import evrop from '../../assets/images/evrop.jpg';
import azia from '../../assets/images/azia.jpg';
import okeania from '../../assets/images/okeania.jpg';
import america from '../../assets/images/america.jpg';
import africa from '../../assets/images/africa.jpg';

const Destinations = () => {
  const regions = [
    {
      id: 1,
      name: 'Європа',
      description: 'Відкрийте для себе чарівні місця Європи з її багатою історією, культурою та неперевершеними краєвидами.',
      image: evrop
    },
    {
      id: 2,
      name: 'Азія',
      description: 'Зануртесь у екзотичну атмосферу Азії з її унікальними традиціями, смачною кухнею та вражаючою природою.',
      image: azia
    },
    {
      id: 3,
      name: 'Океанія',
      description: 'Відкрийте для себе райські острови Океанії з білосніжними пляжами, кришталево чистою водою та багатим підводним світом.',
      image: okeania
    },
    {
      id: 4,
      name: 'Америка',
      description: 'Досліджуйте різноманітність Північної та Південної Америки - від сучасних мегаполісів до древніх цивілізацій та неймовірної природи.',
      image: america
    },
    {
      id: 5,
      name: 'Африка',
      description: 'Відчуйте магію Африки з її дикою природою, сафари, пустелями та багатою культурною спадщиною.',
      image: africa
    }
  ];

  return (
    <div className="directions-page">
      <div className="directions-header">
        <h1>Напрямки подорожей</h1>
        <p>Відкрийте для себе найкращі туристичні напрямки з усього світу</p>
      </div>
      
      <div className="directions-container">
        {regions.map(region => (
          <div key={region.id} className="direction-card">
            <div className="direction-image-container">
              <img src={region.image} alt={region.name} className="direction-image" />
            </div>
            <div className="direction-content">
              <h2>{region.name}</h2>
              <p>{region.description}</p>
              <Link to={`/podoroj/region/${region.id}`} className="direction-button">Детальніше</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;