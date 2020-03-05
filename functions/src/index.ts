const functions = require('firebase-functions')
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
require('dotenv').config()
admin.initializeApp(functions.config().firebase);
const db = admin.firestore()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sharonshaz449@gmail.com',
        pass: 'qgjizvpckiuqypvf'
    }
});

exports.sendEmailToClient = functions.firestore.document('AdminReply/{docid}').onCreate((change: { data: () => any; }, context: any) => {
    console.log('Document change', change.data(), 'Document context', context.params.docid);
    // const projectId = context.params.docid
    const dataR = change.data();
 
        const mailOptions = {
            from: 'Pitseng Art <sharonshaz449@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dataR.email,
            subject: `${dataR.subject}`,
            html: `<p style="font-size: 16px;">Good day <b>${dataR.nameOfClient}</b></p>
                <br />
                <p style="font-size: 15px;">${dataR.message} </p>
                <p style="font-size: 16px;">Creativity takes,<b>Courage</b> </p>
                <br />
                
            ` 
            //banner image
            // <img src="https://media.giphy.com/media/dKdtyye7l5f44/giphy.gif" />
            // email content in HTML
        };
        return transporter.sendMail(mailOptions).then(() =>{
          console.log('sent');
          
        }).catch( (err : any) =>{
            console.log('Error is',err);    
        })
    
})