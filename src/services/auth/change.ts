import { User } from '../../sequelize';
import { v1 } from 'uuid';

export default function change(req: any, res: any, next: any): void {
  const {
    password1,
    password2,
    token,
  } = req.body;

  User.findOne({ where: { token } })
  .then(user => {
    if (!user) {
      return res.status(400).json({
        err: true,
        msg: 'Your reset token has expired, please reset the password again'
      });
    }

    user.update({
      password: password1,
      token: v1(),
    })
    .then(() => {
      res.status(200).json({
        err: false,
        msg: 'Password changed successfully'
      });
    })
    .catch(err => {
      // let's log the error
      res.status(500).json({
        err: true,
        msg: `There was an error processing your request`
      });
    });
  })
  .catch(err => {
    res.status(500).json({
      err: true,
      msg: `There was an error processing your request`
    });
  });
}
