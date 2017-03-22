import db from '../';

function createMotorcycle() {
  db['motorcycle'].findById(1)
    .then(moto =>
      Promise.all([
        moto.setMake('KTM'),
        moto.setModelmoto('SX 125'),
      ]));
}

function createHelmet() {
  db['helmet'].findById(1)
    .then(helmet =>
      Promise.all([
        helmet.setMake('Shark'),
        helmet.setModelhelmet('S900 Dual'),
      ]));
}

export default function create() {
  Promise.all([
    createMotorcycle(),
    createHelmet(),
  ])
    .then(() => {
      Promise.all([
        db['accessorie'].findById(1),
        db['service'].findById(1),
        db['helmet'].findById(1),
      ])
        .then(items => items.map(item => item.addOffer(1)));
  });
}
