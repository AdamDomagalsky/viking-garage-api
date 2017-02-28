import { signinEmail } from '../../helpers/nodemailer'
import { User } from '../../sequelize'

export default function resend(req, res, next):any {
  let { email } = req.body

  if (!email) {
    return res.status(400).json({
      err: true,
      msg: 'Please fill in all the fields.'
    })
  }

  User.findOne({where: { email }})
  .then(user => {
    signinEmail(email, user.dataValues.token)
    .then(() => {
        res.status(200).json({
        err: false,
        msg: 'Resend email successfully'
      })
    })
    .catch(err => {
      res.status(400).json({
        err: true,
        msg: 'Unexpected error ${err}'
      })
    })
  })
  .catch(err => {
    res.status(400).json({
      err: true,
      msg: 'User does not exists ${err}'
    })
  })
}