const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// sgMail.send({
//     to:'rajadurai.rathakrishnan@gmail.com',
//     from:'rajadurai.rathakrishnan@gmail.com',
//     subject: 'This is my first creation',
//     text: 'I hope this one actually get to you.nnod'
// })
const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'rajadurai.rathakrishnan@gmail.com',
        subject:'Thanks for joining in!',
        text:`Welcome to the app , ${name}. let me know how you get along with app. `

    })
}
const sendCancellationEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'rajadurai.rathakrishnan@gmail.com',
        subject:'Cancellation request accepted !',
        text:`Your account cancellation request is accepted, ${name}. please feel free to share your feedback that can improve us. `       
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}