import axios from 'axios';

export const handlePostMsg = (token, title, body) => {
    const fcmData = {
        to: token,
        priority: "high",
        notification: {
            body: body,
            title: title
        }
    };

    return axios({
        method: 'post',
        url: "https://fcm.googleapis.com/fcm/send",
        data: fcmData,
        headers: {
            Authorization:
            "key=AAAAsRu70Yk:APA91bFb0Y-3eaAq3WaFexO7KzyvknIUbh2aEE-Hnay_Wb-KmimVzMZtdzWPkfg_HgkALbd_zf4ZC2E3kKGpKGFQhButNTl8ve-pnjnTyZynjblbABiKUpjWb2rN14_eJlbOSBRt_ZNX",
            "Content-Type": "application/json"
        }
    });
}