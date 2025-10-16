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

RUN npm install -g @anthropic-ai/claude-code
