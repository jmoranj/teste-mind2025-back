import app from './app';

const PORT: any = process.env.PORT || 4000
const HOST = process.env.HOST || 'localhost'

const server = async () => {
  try {
    await app.listen(PORT, HOST, () => console.log(`server running on PORT: http://${HOST + ':' + PORT}`))
  } catch (error) {
    console.log("server didnt start ",error);
    
  }
}


server()