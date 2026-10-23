FROM python:3.14-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV GLOG_minloglevel=3
ENV TF_CPP_MIN_LOG_LEVEL=3

RUN apt-get update && apt-get install -y \
    libgl1 \
    libegl1 \
    libgles2 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001", "--no-access-log", "--log-level", "warning"]