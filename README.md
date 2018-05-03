# open-client-node
This client supports OAuth JWT based on node

### Install Nodejs

There are many ways to install node. It can be accomplished through your OS package manager if it is supported. It can also be downloaded. 

If you are using apt-get on a debian or Ubuntu then the following works:

    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    sudo apt-get install -y nodejs

If downloaded, then unzip the binary archive to any directory you want to install Node, I use /usr/local/lib/nodejs

 sudo mkdir /usr/local/lib/nodejs
 sudo tar -xJvf node-v8.9.4-linux-x64.tar.xz -C /usr/local/lib/nodejs 
 sudo mv /usr/local/lib/nodejs/node-v8.9.4-linux-x64 /usr/local/lib/nodejs/node-v8.9.4

    Set the environment variable ~/.profile, add below to the end

### Nodejs
export NODEJS_HOME=/usr/local/lib/nodejs/node-v8.9.4/bin
export PATH=$NODEJS_HOME:$PATH

    Refresh profile

. ~/.profile

    Test installation using

$ node -v
