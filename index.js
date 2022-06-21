const { QueueClient } = require("@azure/storage-queue");
var axios = require("axios").default;
const { exec } = require("child_process");
const AZURE_STORAGE_CONNECTION_STRING =
  "DefaultEndpointsProtocol=https;AccountName=arquivosod;AccountKey=QMS+Zp5Lz66l3/cpn+VIi2gS9NnNTWI4G2nRq8Rp4PUhZI8pZouxTAijgoVGafPO/6GvGEHGEtqF+AStN+FWFQ==;EndpointSuffix=core.windows.net";
async function main() {
  console.log(
    "Azure Queue Storage client library v12 - JavaScript quickstart sample"
  );
  // Quick start code goes here
  // Create a unique name for the queue
  const queueName = "teste4";

  console.log("\nCreating queue...");
  console.log("\t", queueName);

  // Instantiate a QueueClient which will be used to create and manipulate a queue
  const queueClient = new QueueClient(
    AZURE_STORAGE_CONNECTION_STRING,
    queueName
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
  console.log("\nPeek at the messages in the queue...");

  // Peek at messages in the queue
  const peekedMessages = await queueClient.peekMessages();

  console.log(peekedMessages.peekedMessageItems.length);

  for (i = 0; i < peekedMessages.peekedMessageItems.length; i++) {
    // Display the peeked message
    // console.log("\t", peekedMessages.peekedMessageItems[i].messageText);
    let receivedMessage = peekedMessages.peekedMessageItems[i];
    let base64Str = receivedMessage.messageText;

    let bufferStr = Buffer.from(base64Str, "base64");
    let json = JSON.parse(bufferStr.toString("utf8"));

    let url = json.data.url;

    // let resposta = await axios.get(url);

    // console.log(receivedMessage);
    const deleteMessageResponse = await queueClient.deleteMessage(
      receivedMessage.messageId
    );
    console.log(deleteMessageResponse);
  }

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

main()
  .then(() => console.log("\nDone"))
  .catch((ex) => console.log(ex.message));
