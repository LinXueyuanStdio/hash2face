/**
 * @module webdnn
 */
/** Don't Remove This comment block */

import { MemoryLayout } from "./memory_layout";

/**
 * Graph Descriptor
 * @protected
 */
export interface GraphDescriptor {
    /**
     * Unix timestamp when this graph descriptor is generated
     */
    converted_at: number;

    /**
     * input variables' name
     */
    inputs: string[];

    /**
     * output variables' name
     */
    outputs: string[];

    /**
     * memory position table
     */
    memory_layout: MemoryLayout,

    /**
     * Encoding algorithm of weight binary data.
     */
    weight_encoding: string;

    /**
     * Placeholder dict
     */
    placeholders: { [key: string]: number }
}
