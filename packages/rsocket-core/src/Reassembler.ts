import { Payload } from "@rsocket/rsocket-types";

export interface FragmentsHolder {
  hasFragments: boolean;
  data: Buffer | undefined | null;
  metadata: Buffer | undefined | null;
}

export function add(
  holder: FragmentsHolder,
  dataFragment: Buffer,
  metadataFragment?: Buffer | undefined | null
): void {
  if (!holder.hasFragments) {
    holder.hasFragments = true;
    holder.data = dataFragment;
    if (metadataFragment) {
      holder.metadata = metadataFragment;
    }
    return;
  }

  // TODO: add validation
  holder.data = Buffer.concat([holder.data, dataFragment]);
  if (holder.metadata && metadataFragment) {
    holder.metadata = Buffer.concat([holder.metadata, metadataFragment]);
  }
}

export function reassemble(
  holder: FragmentsHolder,
  dataFragment: Buffer,
  metadataFragment: Buffer | undefined | null
): Payload {
  // TODO: add validation
  holder.hasFragments = false;

  const data = Buffer.concat([holder.data, dataFragment]);

  holder.data = undefined;

  if (holder.metadata) {
    const metadata = metadataFragment
      ? Buffer.concat([holder.metadata, metadataFragment])
      : holder.metadata;

    holder.metadata = undefined;

    return {
      data,
      metadata,
    };
  }

  return {
    data,
  };
}

export function cancel(holder: FragmentsHolder): void {
  holder.hasFragments = false;
  holder.data = undefined;
  holder.metadata = undefined;
}
