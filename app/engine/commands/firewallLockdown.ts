// Firewall Lockdown system — mid-game gate at 5 evidence (LOCKDOWN_EVIDENCE_THRESHOLD)
// Player must find and disable 3 firewall nodes to resume file access.
// Each node has an obvious security question tied to the game's lore.

import type { CommandRegistry } from './types';
import type { GameState, TerminalEntry } from '../../types';
import { createEntry, createEntryI18n } from './utils';
import { translateStatic } from '../../i18n';

// ═══════════════════════════════════════════════════════════════════════════
// NODE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface FirewallNode {
  id: string;
  nameKey: string;
  nameFallback: string;
  questionKey: string;
  questionFallback: string;
  answer: string; // lowercase
}

export const FIREWALL_NODES: FirewallNode[] = [
  {
    id: 'alpha',
    nameKey: 'engine.firewall.node.alpha.name',
    nameFallback: 'NODE ALPHA',
    questionKey: 'engine.firewall.node.alpha.question',
    questionFallback: 'In which Brazilian city did the 1996 incident occur?',
    answer: 'varginha',
  },
  {
    id: 'beta',
    nameKey: 'engine.firewall.node.beta.name',
    nameFallback: 'NODE BETA',
    questionKey: 'engine.firewall.node.beta.question',
    questionFallback: 'What year did the contact event take place?',
    answer: '1996',
  },
  {
    id: 'gamma',
    nameKey: 'engine.firewall.node.gamma.name',
    nameFallback: 'NODE GAMMA',
    questionKey: 'engine.firewall.node.gamma.question',
    questionFallback: 'What is the code name of the witness who guides you?',
    answer: 'ufo74',
  },
];

export const LOCKDOWN_EVIDENCE_THRESHOLD = 5;

// Commands that are ALLOWED during lockdown (everything else is blocked)
export const LOCKDOWN_ALLOWED_COMMANDS = new Set([
  'scan',
  'disable',
  'cd',
  'ls',
  'back',
  'help',
  'status',
  'map',
  'clear',
  'wait',
  'hide',
]);

// Detection increase per command during lockdown
export const LOCKDOWN_DETECTION_TICK = 2;

function getNodeName(node: FirewallNode): string {
  return translateStatic(node.nameKey, undefined, node.nameFallback);
}

function getNodeQuestion(node: FirewallNode): string {
  return translateStatic(node.questionKey, undefined, node.questionFallback);
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCKDOWN TRIGGER OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

export function generateLockdownSequence(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
    createEntry('error', ''),
    createEntryI18n(
      'error',
      'engine.firewall.lockdown_initiated',
      '  ⚠ FIREWALL LOCKDOWN INITIATED ⚠'
    ),
    createEntry('error', ''),
    createEntryI18n(
      'warning',
      'engine.firewall.intrusion_pattern_detected',
      '  Intrusion pattern detected.'
    ),
    createEntryI18n(
      'warning',
      'engine.firewall.file_access_revoked',
      '  File access privileges REVOKED.'
    ),
    createEntryI18n(
      'warning',
      'engine.firewall.three_security_nodes_active',
      '  Three security nodes now ACTIVE.'
    ),
    createEntry('error', ''),
    createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
    createEntry('system', ''),
    createEntryI18n(
      'ufo74',
      'engine.firewall.ufo74_they_locked_us_out',
      '[UFO74]: they locked us out. the firewall just activated three security nodes.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.firewall.ufo74_use_scan',
      '[UFO74]: use "scan" to see the nodes. use "disable <node> <answer>" to shut them down.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.firewall.ufo74_hurry',
      '[UFO74]: hurry. every command you type raises our detection.'
    ),
    createEntry('system', ''),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCKDOWN BYPASS OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

export function generateLockdownBypassSequence(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('warning', '════════════════════════════════════════════════'),
    createEntryI18n(
      'output',
      'engine.firewall.all_nodes_disabled',
      '  All security nodes DISABLED.'
    ),
    createEntryI18n(
      'output',
      'engine.firewall.firewall_bypassed',
      '  ▓▓▓ FIREWALL BYPASSED ▓▓▓'
    ),
    createEntryI18n(
      'output',
      'engine.firewall.file_access_restored',
      '  File access privileges RESTORED.'
    ),
    createEntry('warning', '════════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntryI18n(
      'ufo74',
      'engine.firewall.ufo74_we_broke_through',
      "[UFO74]: we broke through. they won't hold us back."
    ),
    createEntryI18n(
      'ufo74',
      'engine.firewall.ufo74_keep_going',
      '[UFO74]: keep going. find the rest of the evidence before they regroup.'
    ),
    createEntry('system', ''),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND: scan (lockdown override)
// ═══════════════════════════════════════════════════════════════════════════

function scanNodes(state: GameState): TerminalEntry[] {
  const disabled = new Set(state.firewallNodesDisabled || []);
  const totalNodes = FIREWALL_NODES.length;
  const output: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('warning', '════════════════════════════════════════════════'),
    createEntryI18n(
      'warning',
      'engine.firewall.scan_firewall_nodes',
      '  FIREWALL NODE SCAN'
    ),
    createEntry('warning', '════════════════════════════════════════════════'),
    createEntry('system', ''),
  ];

  for (const node of FIREWALL_NODES) {
    const isDisabled = disabled.has(node.id);
    const nodeName = getNodeName(node);
    const question = getNodeQuestion(node);
    const statusLabel = translateStatic(
      isDisabled
        ? 'engine.firewall.scan.statusDisabled'
        : 'engine.firewall.scan.statusActive'
    );
    const entryType = isDisabled ? 'output' : 'error';

    output.push(
      createEntryI18n(
        entryType,
        'engine.firewall.scan.nodeStatus',
        `  ${nodeName} — ${statusLabel}`,
        { node: nodeName, status: statusLabel }
      )
    );

    if (!isDisabled) {
      output.push(
        createEntryI18n(
          'system',
          'engine.firewall.scan.securityQuestion',
          `    Security question: ${question}`,
          { question }
        )
      );
      output.push(
        createEntryI18n(
          'system',
          'engine.firewall.scan.disableHint',
          `    → disable ${node.id} <answer>`,
          { nodeId: node.id }
        )
      );
    }

    output.push(createEntry('system', ''));
  }

  const remaining = totalNodes - disabled.size;
  output.push(
    createEntryI18n(
      'warning',
      'engine.firewall.scan.nodesRemaining',
      `  Nodes remaining: ${remaining}/${totalNodes}`,
      { current: remaining, total: totalNodes }
    )
  );
  output.push(createEntry('system', ''));

  return output;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export const firewallLockdownCommands: CommandRegistry = {
  disable: (args, state) => {
    if (!state.firewallLockdownActive) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.firewall.no_lockdown_active',
            'No firewall lockdown active.'
          ),
        ],
        stateChanges: {},
      };
    }

    const nodeId = args[0]?.toLowerCase().trim();
    const passphrase = args[1]?.toLowerCase().trim();

    if (!nodeId || !passphrase) {
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'warning',
            'engine.firewall.disable_usage',
            'Usage: disable <node> <answer>'
          ),
          createEntryI18n(
            'system',
            'engine.firewall.disable_example',
            'Example: disable alpha varginha'
          ),
          createEntryI18n(
            'system',
            'engine.firewall.disable_hint',
            'Use "scan" to see active nodes and their security questions.'
          ),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    const node = FIREWALL_NODES.find(n => n.id === nodeId);
    if (!node) {
      const validNodes = FIREWALL_NODES.map(n => n.id).join(', ');
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'error',
            'engine.firewall.unknown_node',
            `Unknown node: ${nodeId}`,
            { value: nodeId }
          ),
          createEntryI18n(
            'system',
            'engine.firewall.unknown_node.validNodes',
            `  Valid nodes: ${validNodes}`,
            { value: validNodes }
          ),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    const disabled = new Set(state.firewallNodesDisabled || []);
    if (disabled.has(node.id)) {
      const nodeName = getNodeName(node);
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.firewall.nodeAlreadyDisabled',
            `  ${nodeName} is already disabled.`,
            { node: nodeName }
          ),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    if (passphrase !== node.answer) {
      const question = getNodeQuestion(node);
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'error',
            'engine.firewall.wrong_answer',
            '  ACCESS DENIED — incorrect answer.'
          ),
          createEntryI18n(
            'system',
            'engine.firewall.scan.securityQuestion',
            `  Security question: ${question}`,
            { question }
          ),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.firewall.ufo74_wrong_answer',
            "[UFO74]: that's not it. think about what you've seen."
          ),
          createEntry('system', ''),
        ],
        stateChanges: {
          detectionLevel: Math.min(100, state.detectionLevel + 3),
        },
      };
    }

    // Correct answer — disable the node
    const newDisabled = [...(state.firewallNodesDisabled || []), node.id];
    const allDisabled = newDisabled.length >= FIREWALL_NODES.length;
    const nodeName = getNodeName(node);

    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntryI18n(
        'output',
        'engine.firewall.nodeDisabled',
        `  ${nodeName} — DISABLED ✓`,
        { node: nodeName }
      ),
      createEntry('system', ''),
    ];

    if (!allDisabled) {
      const remaining = FIREWALL_NODES.length - newDisabled.length;
      output.push(
        createEntryI18n(
          'ufo74',
          remaining === 1
            ? 'engine.firewall.ufo74_node_down_singular'
            : 'engine.firewall.ufo74_node_down_plural',
          remaining === 1
            ? '[UFO74]: one down. 1 node left.'
            : `[UFO74]: one down. ${remaining} nodes left.`,
          { remaining }
        )
      );
      output.push(createEntry('system', ''));
    } else {
      output.push(...generateLockdownBypassSequence());
    }

    const stateChanges: Partial<GameState> = {
      firewallNodesDisabled: newDisabled,
    };

    if (allDisabled) {
      stateChanges.firewallLockdownActive = false;
    }

    return {
      output,
      stateChanges,
      triggerFlicker: allDisabled,
    };
  },
};

// Exported for use in the scan command override during lockdown
export { scanNodes };
