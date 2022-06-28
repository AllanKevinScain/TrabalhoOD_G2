
import { QueueClient } from '@azure/storage-queue';

import { AZURE_STORAGE_CONNECTION_STRING } from './config.js';
import { sleep, xml2json, criarJSON, uploadJSON, uploadXML, base642json } from './functions.js';
import axios from 'axios';

function main(initial = 0) {

  while (true) {
    if (initial == 0) {
      uploadXML().then(() => {
        
        const nomeFila = "contoso-fila";

        // Instantiate a QueueClient which will be used to create and manipulate a queue
        const queueClient = new QueueClient(
          AZURE_STORAGE_CONNECTION_STRING,
          nomeFila
        );

        queueClient.receiveMessages({ numberOfMessages: 1 }).then((mensagensFila) => {
          // const peekedMessages = await queueClient.peekMessages();
          if (mensagensFila.receivedMessageItems.length == 0) {
            return;
          }
          let mensagemRecebida = mensagensFila.receivedMessageItems[0];
          let jsonData = base642json(mensagemRecebida.messageText);
          let url = jsonData.data.url;
          console.log(url);
          let filename = url.substring(url.lastIndexOf('/') + 1);
          axios.get(url).then((xml) => {
            let json = xml2json(xml.data);
            criarJSON(filename.replace(".xml", ".json"), json);
            uploadJSON().then(() => {
              queueClient.deleteMessage(
                mensagemRecebida.messageId,
                mensagemRecebida.popReceipt
              );
            })

            // // console.log(receivedMessage);

          })


        }).catch(e => {
          console.log(e);
        })
      }
      )
    }
  }


  main();
