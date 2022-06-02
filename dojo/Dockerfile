
   
FROM python:3.10


WORKDIR /app
ADD . /app/dojo
WORKDIR /app/dojo
RUN pip install -r requirements.txt
WORKDIR /app
EXPOSE 5555
CMD ["uvicorn", "dojo.rest.main:application", "--port=5555", "--host", "0.0.0.0"]
