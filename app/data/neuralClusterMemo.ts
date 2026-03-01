// Neural Cluster comms file (hidden until override)
// This file is only visible after override protocol is used

import { FileNode } from '../types';

const neuralClusterMemo: FileNode = {
  type: 'file',
  name: 'neural_cluster_memo.txt',
  status: 'restricted',
  content: [
    '═══════════════════════════════════════════════════════════',
    'MEMO: Neural Cluster Initiative',
    '═══════════════════════════════════════════════════════════',
    '',
    'A neural network was constructed to emulate the dissected brain of the recovered entity.',
    'The system is capable of storing and emitting memory fragments from the scout organism.',
    '',
    'Access to the cluster is strictly prohibited except under override protocol.',
    '',
    'To initiate interface: echo neural_cluster',
    '',
    'All emissions are non-linguistic. Interpret with caution.',
    '',
    '═══════════════════════════════════════════════════════════',
  ],
  videoTrigger: {
    src: 'https://drive.google.com/uc?export=download&id=1Gzqrt1QNqC5OuXjxo7U5NopTuZVwXcI7',
    title: 'NEURAL_CLUSTER_MEMO_RECOVERY.VID',
    tone: 'surveillance',
  },
  accessThreshold: 4, // Only visible after override
  requiredFlags: ['adminUnlocked'],
};

export default neuralClusterMemo;
