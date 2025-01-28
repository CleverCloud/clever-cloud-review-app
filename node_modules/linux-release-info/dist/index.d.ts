/*!
 * linux-release-info
 * Get Linux release info (distribution name, version, arch, release, etc.)
 * from '/etc/os-release' or '/usr/lib/os-release' files and from native os
 * module. On Windows and Darwin platforms it only returns common node os module
 * info (platform, hostname, release, and arch)
 *
 * Licensed under MIT
 * Copyright (c) 2018-2020 [Samuel Carreira]
 */
export interface LinuxReleaseInfoOptions {
    /**
     * read mode, possible values: 'async' and 'sync'
     *
     * @default 'async'
     */
    mode?: 'async' | 'sync';
    /**
     * custom complete file path with os info default null/none
     * if not provided the system will search on the '/etc/os-release'
     * and  '/usr/lib/os-release' files
     *
     * @default null
     */
    custom_file?: string | null | undefined;
    /**
     * if true, show console debug messages
     *
     * @default false
     */
    debug?: boolean;
}
/**
 * Get OS release info from 'os-release' file and from native os module
 * on Windows or Darwin it only returns common os module info
 * (uses native fs module)
 * @returns {object} info from the current os
 */
export declare function releaseInfo(options: LinuxReleaseInfoOptions): object;
