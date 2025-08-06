FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# Install basic development tools and architecture support
RUN apt update && apt install -y less htop bash-completion \
    && dpkg --add-architecture amd64 \
    && apt-get update \
    && apt-get install -y libc6:amd64

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Install Java (required for SonarScanner)
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Install SonarScanner globally
RUN npm install -g sonarqube-scanner

RUN npm install -g @anthropic-ai/claude-code

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=16
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}" 