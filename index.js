
import { QueueClient } from '@azure/storage-queue';
import { AZURE_STORAGE_CONNECTION_STRING } from './config.js';
import { sleep, xml2json, criarJSON, uploadJSON, uploadXML, base642json } from './functions.js';
import axios from 'axios';

uploadXML();
async function main() {


  const nomeFila = "contoso-fila";

  // Instantiate a QueueClient which will be used to create and manipulate a queue
  const queueClient = new QueueClient(
    AZURE_STORAGE_CONNECTION_STRING,
    nomeFila
  );

  // Create the queue
  // const createQueueResponse = await queueClient.create();
  // console.log("Queue created, requestId:", createQueueResponse.requestId);

  // Send several messages to the queue
  // await queueClient.sendMessage("First message");
  // await queueClient.sendMessage("Second message");
  // const sendMessageResponse = await queueClient.sendMessage("Third message");

  // console.log("Messages added, requestId:", sendMessageResponse.requestId);

  //espiar a fila

  // Peek at messages in the queue



  try {
    const mensagensFila = await queueClient.receiveMessages({ numberOfMessages: 1 });
    // const peekedMessages = await queueClient.peekMessages();
    if(mensagensFila.receivedMessageItems.length == 0){
      return;
    }
    let mensagemRecebida = mensagensFila.receivedMessageItems[0];
    let jsonData = base642json(mensagemRecebida.messageText);
    let url = jsonData.data.url;
    console.log(url);
    let filename = url.substring(url.lastIndexOf('/')+1);
    let xml = await axios.get(url);
    
    let json = xml2json(xml.data);  
    criarJSON(filename.replace(".xml", ".json"), json);
    uploadJSON();

    // // console.log(receivedMessage);
    const respostaExcluirMensagem = await queueClient.deleteMessage(
       mensagemRecebida.messageId,
       mensagemRecebida.popReceipt
    );    
  } catch (e) {

  }
  await sleep(1000);
  main();

  // for (i = 0; i < mensagensFila.peekedMessageItems.length; i++) {
  //   // Display the peeked message
  //   // console.log("\t", peekedMessages.peekedMessageItems[i].messageText);
  //   let receivedMessage = mensagensFila.peekedMessageItems[i];
  //   let base64Str = receivedMessage.messageText;

  //   let bufferStr = Buffer.from(base64Str, "base64");
  //   let json = JSON.parse(bufferStr.toString("utf8"));

  //   let url = json.data.url;

  //   // let resposta = await axios.get(url);

  //   // console.log(receivedMessage);
  //   const deleteMessageResponse = await queueClient.deleteMessage(
  //     receivedMessage.messageId
  //   );
  //   console.log(deleteMessageResponse);
  // }

  //receber mensagem da fila e remover
  // console.log("\nReceiving messages from the queue...");

  // console.log("\nReceiving messages from the queue...");

  // // Get messages from the queue
  // const receivedMessagesResponse = await queueClient.receiveMessages({ numberOfMessages : 5 });

  // console.log("Messages received, requestId:", receivedMessagesResponse);

  // // 'Process' and delete messages from the queue
  // for (i = 0; i < receivedMessagesResponse.receivedMessageItems.length; i++) {
  //     receivedMessage = receivedMessagesResponse.receivedMessageItems[i];

  //     // 'Process' the message
  //     console.log("\tProcessing:", receivedMessage.messageText);

  //     // Delete the message
  //     // const deleteMessageResponse = await queueClient.deleteMessage(
  //     //     receivedMessage.messageId,
  //     //     receivedMessage.popReceipt
  //     // );
  //     // console.log("\tMessage deleted, requestId:", deleteMessageResponse.requestId);
  // }
}

main();
