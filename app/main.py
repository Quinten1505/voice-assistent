from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# Serve static files (CSS, JavaScript, images, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")

# initialize the directory './templates' which holds the html files
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def root():
    return {"message": "Hello FastAPI"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)