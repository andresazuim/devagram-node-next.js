import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import { RespostaPadraoMsg } from "types/RespostaPadraoMsg";

mongoose.set("strictQuery", true);

export const conectarMongoDB = (handler: NextApiHandler) =>
    async(req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }

    const {DB_CONEXAO_STRING} = process.env;

    if(!DB_CONEXAO_STRING){
        return res.status(500).json({erro: 'ENV de configuracao do banco nao informada'});
    }
        
    mongoose.connection.on('conected', () => console.log('Banco de dados conectado'));
    mongoose.connection.on('erro', () => console.log('Ocorreu erro ao se conectar no banco'))
    await mongoose.connect(DB_CONEXAO_STRING);
        
    return handler(req, res);
}
