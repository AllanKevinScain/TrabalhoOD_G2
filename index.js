
import { QueueClient } from '@azure/storage-queue';

import { AZURE_STORAGE_CONNECTION_STRING } from './config.js';
import { sleep, xml2json, criarJSON, uploadJSON, uploadXML, base642json } from './functions.js';
import axios from 'axios';
import fs from 'fs';

console.log("Iniciando upload assíncrono dos arquivos xml!");

async function main() {
  while (true) {
    const nomeFila = "contoso-fila";

    // Instantiate a QueueClient which will be used to create and manipulate a queue
    const queueClient = new QueueClient(
      AZURE_STORAGE_CONNECTION_STRING,
      nomeFila
    );
    console.log("Lendo a fila de 1 por 1");
    let mensagensFila = await queueClient.receiveMessages({ numberOfMessages: 1 });
    // const peekedMessages = await queueClient.peekMessages();
    if (mensagensFila.receivedMessageItems.length > 0) {
      let mensagemRecebida = mensagensFila.receivedMessageItems[0];
      let jsonData = base642json(mensagemRecebida.messageText);
      let url = jsonData.data.url;
      let name = url.substring(url.lastIndexOf('/') + 1);

      if (name.includes(".json")) {
        console.log("O arquivo, ", name, " chegou no container (contoso-json)");
      }
      else if (name.includes(".xml")) {
        console.log("O arquivo : ", name, " foi enviado para o container, lendo o arquivo...");
        axios.get(url, {
          onDownloadProgress: (progressEvent => {
            const total = parseFloat(progressEvent.currentTarget.responseHeaders['Content-Length'])
            const current = progressEvent.currentTarget.response.length

            let percentCompleted = Math.floor(current / total * 100)
            console.log("Progresso de download da url " + url, " ", percentCompleted, " %");
          })
        }).then(async (xml) => {
          console.log("Iniciando conversão do xml");
          let json = xml2json(xml.data);
          console.log("Conversão finalizada");
          console.log("Criando arquivo JSON local");
          let { caminho, filename } = criarJSON(name.replace(".xml", ".json"), json);
          console.log("Iniciando upload o arquivo JSON");
          await uploadJSON(fs.createReadStream(caminho), filename);
          console.log("Feito o upload, deletando arquivo local");
          fs.unlinkSync(caminho);
        }).catch(e => {
          console.log("Não foi possível converter");
          console.log(e);
        });
      }
      await queueClient.deleteMessage(
        mensagemRecebida.messageId,
        mensagemRecebida.popReceipt
      );
    }

    await sleep(1000);
  }

}

uploadXML();
main();

