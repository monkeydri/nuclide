/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 * @format
 */

import fsPromise from 'nuclide-commons/fsPromise';
import JediServerManager from '../lib/JediServerManager';

describe('JediServerManager', () => {
  let jediServerManager;

  beforeEach(() => {
    jediServerManager = new JediServerManager();
  });

  it('caches syspaths by file name', () => {
    const mockPath = '/a/b/c';
    const spy = spyOn(fsPromise, 'findFurthestFile').andReturn(
      Promise.resolve(mockPath),
    );

    const sysPath = jediServerManager.getSysPath('/test/file.txt');
    expect(sysPath).toEqual([]);
    expect(spy).toHaveBeenCalledWith('__init__.py', '/test', true);

    // Second call with the same source path should retrieve top-level module path
    // directly from cache.
    (fsPromise.findFurthestFile: any).reset();
    expect(spy).not.toHaveBeenCalled();

    waitsFor(() =>
      jediServerManager.getSysPath('/test/file.txt').includes(mockPath),
    );
  });
});
