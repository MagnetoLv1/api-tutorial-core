import { Injectable } from '@angular/core';
import { ElectronWindow } from './electron.window';
import * as fs from 'fs';
declare let window: ElectronWindow;

@Injectable()
export class FilesystemService {

  private _fs: any
  constructor() {
  }
  protected get fs(): any {
    if (!this._fs) {
      if (window && window.require) {
        this._fs = window.require('fs');
        return this._fs;
      }
      return null;
    }
    return this._fs;
  }


  public writeFile(filename: string, data: any, callback?: (err: NodeJS.ErrnoException) => void): void {
    this.fs.writeFile(filename, data, callback);
  }


  public realpath(path: string | Buffer, callback?: (err: NodeJS.ErrnoException, resolvedPath: string) => any): void {
    this.fs.realpath(path, callback);
  }


  public realpathSync(path: string | Buffer, cache?: { [path: string]: string }): string {
    return this.fs.realpathSync(path, cache);
  };
}
