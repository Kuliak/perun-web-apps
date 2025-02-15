import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AbstractControl, UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';

export interface AddHostDialogData {
  theme: string;
  facilityId: number;
}

@Component({
  selector: 'app-add-host-dialog',
  templateUrl: './add-host-dialog.component.html',
  styleUrls: ['./add-host-dialog.component.scss'],
})
export class AddHostDialogComponent implements OnInit {
  theme: string;
  loading = false;
  hostsCtrl: UntypedFormControl;

  hostPattern = new RegExp(
    '^(?!:\\/\\/)(?=.{1,255}$)((.{1,63}\\.){1,127}(?![0-9]*$)[a-z0-9-]+\\.?)$|^(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}$'
  );

  constructor(
    private dialogRef: MatDialogRef<AddHostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: AddHostDialogData,
    public facilitiesManager: FacilitiesManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService
  ) {}

  private static parseRange(range: string): number[] {
    const [lower, upper] = range.split('-');

    const from = parseInt(lower.substring(1, lower.length), 10);
    const to = parseInt(upper.substring(0, upper.length), 10);

    return [from, to];
  }

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.hostsCtrl = new UntypedFormControl('', [Validators.required, this.hostsNameValidator()]);
    this.hostsCtrl.markAllAsTouched();
  }

  onAdd(): void {
    this.loading = true;
    const hostNames: string[] = (this.hostsCtrl.value as string).split('\n');
    let generatedHostNames: string[] = [];

    for (const name of hostNames) {
      generatedHostNames = generatedHostNames.concat(this.parseHostName(name));
    }
    this.facilitiesManager.addHosts(this.data.facilityId, generatedHostNames).subscribe(
      () => {
        this.notificator.showSuccess(this.translate.instant('DIALOGS.ADD_HOST.SUCCESS') as string);
        this.dialogRef.close(true);
      },
      () => (this.loading = false)
    );
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private hostsNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: { [key: string]: string } } | null => {
      let generatedHostNames: string[] = [];
      const hostNames = (control.value as string).split('\n');
      for (const name of hostNames) {
        generatedHostNames = generatedHostNames.concat(this.parseHostName(name));
      }
      for (const host of generatedHostNames) {
        if (!this.hostPattern.test(host)) {
          return { invalidHost: { value: host } };
        }
      }
      return null;
    };
  }

  private parseHostName(name: string): string[] {
    const rangeRegex = new RegExp('[[0-9]+-[0-9]+]', 'g');
    const prefixes = name.split(rangeRegex);
    const suffixes = name.match(rangeRegex);

    if (suffixes == null) {
      if (name === '') {
        return [];
      }
      return [name];
    }

    let nameParts: string[][] = [];

    for (let i = 0; i < prefixes.length - 1; i++) {
      const [from, to] = AddHostDialogComponent.parseRange(suffixes[i]);
      let parts = [];

      for (let j = from; j <= to; j++) {
        parts = parts.concat(prefixes[i].concat(j.toString()));
      }
      nameParts = nameParts.concat([parts]);
    }
    nameParts = nameParts.concat([[prefixes[prefixes.length - 1]]]);

    return this.joinHostNames(nameParts, 0);
  }

  private joinHostNames(nameParts: string[][], position: number): string[] {
    if (position === nameParts.length - 1) {
      return nameParts[position];
    }

    const suffixes = this.joinHostNames(nameParts, position + 1);
    const joinedNames: string[] = [];

    for (const name of nameParts[position]) {
      for (const suffix of suffixes) {
        joinedNames.push(name.concat(suffix));
      }
    }
    return joinedNames;
  }
}
