import {
  Request,
  Response,
  NextFunction,
} from 'express';
import db from '../../sequelize';
import * as err from '../error';

const query = (point, dist) =>
  `SELECT * FROM offers WHERE ST_DWithin(coord, ST_SetSRID(ST_Point(${point[0]}, ${point[1]}), 4326), ${dist});`;

export default function getAll(req: Request, res: Response, next: NextFunction): any {
  const lat = req.query.lat || 52.237684;
  const lng = req.query.lng || 21.030086;
  const dist = req.query.dist || 10000;

  db['sequelize'].query(query([lat, lng], dist), { type: db['sequelize'].QueryTypes.SELECT })
    .then((offers) => {
      if (!offers) return res.status(400).json(err.notExists);
      res.json(offers);
    })
    .catch((err) => {
      console.log(`Unexpected error ${err}`);
      res.status(500).json(err.unexpected);
    });
}