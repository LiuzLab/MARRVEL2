FROM node:20

# install Python and build tools
RUN apt-get update
RUN apt-get install -y --no-install-recommends \
        python3 python3-dev python3-pip python3-venv git gcc make
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
# Create a virtual environment and activate it
RUN python3 -m venv /MARRVEL/server/venv
ENV PATH="/MARRVEL/server/venv/bin:$PATH"

# ARM64 only: install the SSE2NEON shim and make a wrapper for emmintrin.h
RUN if [ "$(dpkg --print-architecture)" = "arm64" ]; then \
        git clone --depth 1 https://github.com/DLTcollab/sse2neon.git /tmp/sse2neon && \
        mkdir -p /usr/local/include && \
        cp /tmp/sse2neon/sse2neon.h /usr/local/include/sse2neon.h && \
        printf '#include "sse2neon.h"\n' > /usr/local/include/emmintrin.h && \
        rm -rf /tmp/sse2neon; \
    fi
ENV CPATH=/usr/local/include
ENV C_INCLUDE_PATH=/usr/local/include

RUN mkdir -p /MARRVEL/server
WORKDIR /MARRVEL/server
# Install dependencies
COPY package*.json ./
RUN npm install
# Copy the rest of the application
COPY . .
# Install Python dependencies
RUN pip install -r requirements.txt

# Configure TransVar
RUN transvar config -k reference -v /root/.transvar.download/hg19.fa --refversion hg19
RUN TRANSVAR_CFG=$(find /MARRVEL/server/venv/lib/ -type f -name transvar.cfg) \
    && echo "refseq = /root/.transvar.download/hg19.refseq.gff.gz.transvardb" >> $TRANSVAR_CFG \
    && echo "ensembl = /root/.transvar.download/hg19.ensembl.gtf.gz.transvardb" >> $TRANSVAR_CFG \
    && echo "\n[hg38]" >> $TRANSVAR_CFG \
    && echo "refseq = /root/.transvar.download/hg38.refseq.gff.gz.transvardb" >> $TRANSVAR_CFG \
    && echo "ensembl = /root/.transvar.download/hg38.ensembl.gtf.gz.transvardb" >> $TRANSVAR_CFG \
    && echo "reference = /root/.transvar.download/hg38.fa" >> $TRANSVAR_CFG

EXPOSE 8080
