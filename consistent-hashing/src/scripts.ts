import { exec } from "child_process";
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function getServer(): Promise<string[]> {
    const command = "kubectl get deployment -n dev | grep simple-server | awk '{print $1}'";
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
        console.error(`Error fetching server list: ${stderr}`);
        return [];
    }
    return stdout.split('\n').filter(str => str !== '');
}


export async function addServer(): Promise<string> {
    // 生成 template 
    const uuid = crypto.randomUUID().slice(0, 8); 
    const deployTemplate = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: simple-server-${uuid}
  labels:
    app: simple-server-${uuid}
  namespace: dev
spec:
  replicas: 1 
  selector:
    matchLabels:
      app: simple-server-${uuid}
  template:
    metadata:
      labels:
        app: simple-server-${uuid}
    spec:
      containers:
        - name: simple-server
          image: hanbro0112/simple-server:latest
          ports:
            - containerPort: 80
`;
    // 設定 service 以使用 dns 名稱訪問
    const serviceTemplate = `
apiVersion: v1
kind: Service
metadata:
  name: simple-server-${uuid}
  labels:
    app: simple-server-${uuid}
  namespace: dev
spec:
  selector:
    app: simple-server-${uuid} # 匹配 Deployment 中的 labels
  type: ClusterIP
  ports:
    - protocol: TCP
      port: 80 # Service 的端口
      targetPort: 80 # Pod 中容器的端口
`;

    const { stdout, stderr } = await execPromise(`kubectl apply -f - <<< "${deployTemplate}" | kubectl apply -f - <<< "${serviceTemplate}"`);
    if (stderr) {
        console.error(`Error adding server: ${stderr}`);
        return '';
    }
    console.log(`Server added: ${stdout}`);
    return uuid;
}

export async function removeServer(uuid: string): Promise<boolean> {
    const { stdout, stderr } = await execPromise(`kubectl delete deployment simple-server-${uuid} -n dev && kubectl delete service simple-server-${uuid} -n dev`);
    if (stderr) {
        console.error(`Error removing server: ${stderr}`);
        return false;
    }
    console.log(`Server removed: ${stdout}`);
    return true;
}

export async function sendRequestToServer(uuid: string): Promise<boolean> {
    const { stdout, stderr } = await execPromise(`curl -s http://simple-server-${uuid}`);
    if (stderr) {
        console.error(`Error sending request to server: ${stderr}`);
        return false;
    }
    return stdout === 'ok';
}
