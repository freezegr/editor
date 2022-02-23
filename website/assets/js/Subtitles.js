const subsrt = require('subsrt');

class Subtitles {
    constructor() {
        this.data = null
        this.subtitles = null;
        this.selected = null;

        this.subsListElem = $(".subtitlesBoxFormsAll")
        this.textBoxElem = $('.textBox')
        this.videoElem = $(".video")
    }

    //init the class and add defautls subs
    init() {
        this.data = loadDefaultSubs();
        this.subsListElem.empty();
        this.subtitles = this.data.filter(x => x.section == "Events")[0].body
        this.addSubtitles({}, false)
    }

    //add titles
    openSubTitles(data) {
        document.title = data.filename;
        this.subsListElem.empty();
        this.data = data.subtitles;
        this.subtitles = data["subtitles"].filter(x => x.section == "Events")[0].body

        this.subtitles.forEach((x, count) => {
            x.value.count = count
            let id;
            do {
                id = this.generateID();
                console.log(id)
            } while (!this.getSubtitle(id))
            x.value.id = id

            this.addSubtitles(x.value)
        });

        let ProjectOpts = this.data.filter(x => x.section == "Aegisub Project Garbage");
        if (ProjectOpts.length != 0 && ProjectOpts[0].body.filter(l => l.key == "Video File").length != 0 && ProjectOpts[0].body.filter(l => l.key == "Video File")[0].value != undefined) {
            $.confirm({
                title: 'Confirm!',
                content: 'Thery are a video do you want load it',
                buttons: {
                    cancel: function () {
                        //do nothing
                    },
                    confirm: function () {
                        $(".video")[0].src = ProjectOpts[0].body.filter(l => l.key == "Video File")[0].value;
                        let source = `data:text/ass;base64,W1NjcmlwdCBJbmZvXQo7IFNjcmlwdCBnZW5lcmF0ZWQgYnkgQWVnaXN1YiA5MjEzLCBEYXlkcmVhbSBDYWZlIEVkaXRpb24gW1NoaW5vbl0KOyBodHRwOi8vd3d3LmFlZ2lzdWIub3JnLwpUaXRsZTogSG9ycmlibGVTdWJzClNjcmlwdFR5cGU6IHY0LjAwKwpXcmFwU3R5bGU6IDAKWUNiQ3IgTWF0cml4OiBUVi43MDkKUGxheVJlc1g6IDEyODAKUGxheVJlc1k6IDcyMAoKW0FlZ2lzdWIgUHJvamVjdCBHYXJiYWdlXQo7IEF1ZGlvIEZpbGU6IGxlbC5ta3YKVmlkZW8gRmlsZTogQzpVc2Vyc3N0YXRzRG93bmxvYWRzW01UQkJdIENsYXNzcm9vbSBvZiB0aGUgRWxpdGVbTVRCQl0gQ2xhc3Nyb29tIG9mIHRoZSBFbGl0ZSAtIDEyIFszQTNCOTkwNl0ubWt2CjsgS2V5ZnJhbWVzIEZpbGU6IHlvdWtvc28xMl9wcmVtdXhfa2V5ZnJhbWVzLmxvZwo7IFZpZGVvIEFSIE1vZGU6IDQKOyBWaWRlbyBBUiBWYWx1ZTogMS43Nzc3NzgKOyBWaWRlbyBab29tIFBlcmNlbnQ6IDAuNzUwMDAwCjsgU2Nyb2xsIFBvc2l0aW9uOiA2NiAKVmlkZW8gUG9zaXRpb246IDczNDYKCltWNCsgU3R5bGVzXQpGb3JtYXQ6IE5hbWUsIEZvbnRuYW1lLCBGb250c2l6ZSwgUHJpbWFyeUNvbG91ciwgU2Vjb25kYXJ5Q29sb3VyLCBPdXRsaW5lQ29sb3VyLCBCYWNrQ29sb3VyLCBCb2xkLCBJdGFsaWMsIFVuZGVybGluZSwgU3RyaWtlT3V0LCBTY2FsZVgsIFNjYWxlWSwgU3BhY2luZywgQW5nbGUsIEJvcmRlclN0eWxlLCBPdXRsaW5lLCBTaGFkb3csIEFsaWdubWVudCwgTWFyZ2luTCwgTWFyZ2luUiwgTWFyZ2luViwgRW5jb2RpbmcKU3R5bGU6IERlZmF1bHQsR2FuZGhpIFNhbnMsNTAsJkgwMEZGRkZGRiwmSDAwMDAwMEZGLCZIMDAwMDAwMDAsJkhBMDAwMDAwMCwtMSwwLDAsMCwxMDAsMTAwLDAsMCwxLDIuNCwxLDIsMTUwLDE1MCw0MCwxClN0eWxlOiBEZWZhdWx0LWFsdCxHYW5kaGkgU2Fucyw1MCwmSDAwRkZGRkZGLCZIMDAwMDAwRkYsJkgwMDJBNjc1RiwmSEEwMDAwMDAwLC0xLDAsMCwwLDEwMCwxMDAsMCwwLDEsMi40LDEsMiwxNTAsMTUwLDQwLDEKU3R5bGU6IFNpZ25zLEFyaWFsLDQwLCZIMDBGRkZGRkYsJkgwMDAwMDBGRiwmSDAwMDAwMDAwLCZIMDAwMDAwMDAsMCwwLDAsMCwxMDAsMTAwLDAsMCwxLDAsMCw1LDEwLDEwLDEwLDEKU3R5bGU6IE9QL0VELFF1YWRyYWF0LUJvbGQsNjAsJkgwMEZGRkZGRiwmSDAwMDAwMEZGLCZIMDAwMDAwMDAsJkgwMDAwMDAwMCwwLDAsMCwwLDEwMCwxMDAsMCwwLDEsMCwwLDEsODAsODAsMjUsMQoKW0V2ZW50c10KRm9ybWF0OiBMYXllciwgU3RhcnQsIEVuZCwgU3R5bGUsIE5hbWUsIE1hcmdpbkwsIE1hcmdpblIsIE1hcmdpblYsIEVmZmVjdCwgVGV4dApEaWFsb2d1ZTogMTAsMDowMDoyOC4zOCwwOjAwOjI5LjMxLERlZmF1bHQsaWJ1LDAsMCwwLCzOpM65O3tXaGF0P30KRGlhbG9ndWU6IDEwLDA6MDA6NDMuNTYsMDowMDo0NC42OSxEZWZhdWx0LGlidSwwLDAsMCwsSWJ1a2kgzrXOtM+OLntJYnVraSBoZXJlLn0KRGlhbG9ndWU6IDEwLDA6MDA6NDUuNzgsMDowMDo0OC42NSxEZWZhdWx0LGlidSwwLDAsMCwszojPh8+JIM6xz4DOv866z4TOrs+DzrXOuSDPhM63zr0gzrrOrM+Bz4TOsS3Ous67zrXOuc60zq8gz4TOt8+CIM6kzqzOvs63z4IgzpQsIM+Dz43OvM+Gz4nOvc6xIM68zrUgz4TOuc+CIM6/zrTOt86zzq/Otc+CLntJJ3ZlIGFjcXVpcmVkIENsYXNzIEQncyBrZXkgY2FyZCwgYXMgZGlyZWN0ZWQufQpEaWFsb2d1ZTogMTAsMDowMDo1MS40MywwOjAwOjUyLjE0LERlZmF1bHQsaWJ1LDAsMCwwLCx7WWVzLn3Onc6xzrkuCkRpYWxvZ3VlOiAxMCwwOjAwOjU0LjExLDA6MDA6NTQuOTEsRGVmYXVsdCxpYnUsMCwwLDAsLHtZZXMufc6dzrHOuS4KRGlhbG9ndWU6IDEwLDA6MDA6NTYuODIsMDowMDo1Ny45MyxEZWZhdWx0LGthdCwwLDAsMCwszprOsc+EzqzOu86xzrLOsS57SSBzZWUufQpEaWFsb2d1ZTogMTAsMDowMDo1Ny45MywwOjAwOjU5LjQ2LERlZmF1bHQsa2F0LDAsMCwwLCzOmM6xIM+Dz4XOvc6xzr3PhM63zrjOv8+NzrzOtSDOtc66zrXOry57V2UnbGwgbWVldCB1cCB0aGVyZS59CgpbQWVnaXN1YiBFeHRyYWRhdGFdCkRhdGE6IDAsYS1tbyxleyJ1dWlkIiMzQSIxYTM3YzE1NC0xNmRkLTRiYTEtOTAzMC0wMjIzZDExY2Q3NmYiIzJDIm9yaWdpbmFsVGV4dCIjM0Eie1xmbkZGSnVzdGxlZnRoYW5kXGZzNTBcYmx1cjVcZnJ6MzQ2LjNcYyZIM0E0NjUwJlxwb3MoNTE5LjYyIzJDNDk3LjUyNClcYWxwaGEmSEMwJn1OYW1pbmcgQ2xhc3MgRCdzIGxlYWRlciJ9CkRhdGE6IDEsYS1tbyxleyJ1dWlkIiMzQSI0MzEyNDU0My03NDYzLTQ4MzAtYTI4Yi03ZmQxZDM4ZmFkZmIiIzJDIm9yaWdpbmFsVGV4dCIjM0Eie1xmbkZGSnVzdGxlZnRoYW5kXGJsdXI1XGZyejM0Ni4zXGMmSDNBNDY1MCZccG9zKDkzNy4yNjkjMkM1MjkuNjUyKVxhbHBoYSZIQzAmfVRvdGFsIn0KRGF0YTogMixhLW1vLGV7InV1aWQiIzNBIjk0MjA3OGMwLWNlNzgtNDcxZC04NGZmLWI5MWViZWI2NWMzMiIjMkMib3JpZ2luYWxUZXh0IiMzQSJ7XGZuRkZKdXN0bGVmdGhhbmRcYmx1cjVcZnM1MFxmcnozNDYuM1xjJkgzQTQ2NTAmXHBvcyg1NTQuNzk0IzJDMzg5Ljg0MSlcYWxwaGEmSEMwJn1TcG90IG9jY3VwYXRpb24gKEEgLSBQKSJ9CkRhdGE6IDMsYS1tbyxleyJ1dWlkIiMzQSJhNGQzMmM3Zi00YjQ5LTQxNmMtODJmNy0zM2M2NGQxZmI3MGUiIzJDIm9yaWdpbmFsVGV4dCIjM0Eie1xmbkZGSnVzdGxlZnRoYW5kXGZzNTBcYmx1cjVcZnJ6MzQ2LjNcYyZIM0E0NjUwJlxwb3MoNTE5Ljg0MiMyQzI2NC45NTMpXGFscGhhJkhDMCZ9U3BvdCBtaXN1c2UifQpEYXRhOiA0LGEtbW8sZXsidXVpZCIjM0EiNmVmYTU0YjMtMDAyMi00NDMzLWE1ZGYtZWFhYzc3ODAyNGFlIiMyQyJvcmlnaW5hbFRleHQiIzNBIntcZm5GRkp1c3RsZWZ0aGFuZFxibHVyNVxmcnozNDYuM1xjJkgzQTQ2NTAmXHBvcyg2MDMuNTcxIzJDMjA2KVxhbHBoYSZIQzAmfVNha2F5YW5hZ2kgZHJvcHBpbmcgb3V0In0KRGF0YTogNSxhLW1vLGV7InV1aWQiIzNBIjk5MmY3NzIwLTZlOWMtNGVjZS1hNWM3LWJmYzBhM2Y5YzUwMiIjMkMib3JpZ2luYWxUZXh0IiMzQSJ7XGZuRkZKdXN0bGVmdGhhbmRcZnM1MFxibHVyMC42XGZyejM0Ni4zXGMmSDM1NDI1QSZccG9zKDUxOS42MiMyQzQ5Ny41MjQpfU57KlxjJkgzNDQxNTkmfWF7KlxjJkgzMzQwNTcmfW17KlxjJkgzMjNGNTYmfWl7KlxjJkgzMTNFNTUmfW57KlxjJkgzMDNENTQmfWcgeypcYyZIMkYzQTUxJn1DeypcYyZIMkUzOTUwJn1seypcYyZIMkQzODRGJn1heypcYyZIMkMzNzREJn1zeypcYyZIMkIzNjRDJn1zIHsqXGMmSDI5MzQ0OSZ9RHsqXGMmSDI4MzM0OCZ9J3sqXGMmSDI3MzI0NyZ9cyB7KlxjJkgyNjJGNDQmfWx7KlxjJkgyNTJFNDMmfWV7KlxjJkgyNDJENDImfWF7KlxjJkgyMzJDNDEmfWR7KlxjJkgyMjJCM0YmfWV7XGMmSDIxMkEzRSZ9ciJ9CkRhdGE6IDYsYS1tbyxleyJ1dWlkIiMzQSI1ZmY2ZWFiZS0zZTA3LTRkOTAtYjY2Yy0wYzllZjU2MzQxZTciIzJDIm9yaWdpbmFsVGV4dCIjM0Eie1xmbkZGSnVzdGxlZnRoYW5kXGJsdXIwLjZcZnJ6MzQ2LjNcYyZIMTQxQTJBJlxwb3MoOTM3LjI2OSMyQzUyOS42NTIpfVRvdGFsIn0KRGF0YTogNyxhLW1vLGV7InV1aWQiIzNBImZkYjYxM2E2LWJlYTktNGY0My04MjI2LTcyOTZjY2Q2ZGE3ZSIjMkMib3JpZ2luYWxUZXh0IiMzQSJ7XGZuRkZKdXN0bGVmdGhhbmRcYmx1cjAuNlxmczUwXGZyejM0Ni4zXGMmSDNGNEQ2OSZccG9zKDU1NC43OTQjMkMzODkuODQxKX1TeypcYyZIM0U0QjY3Jn1weypcYyZIM0M0QTY1Jn1veypcYyZIM0I0ODYzJn10IHsqXGMmSDM4NDU1RiZ9b3sqXGMmSDM2NDM1RCZ9Y3sqXGMmSDM1NDE1QiZ9Y3sqXGMmSDMzNDA1OSZ9dXsqXGMmSDMyM0U1NyZ9cHsqXGMmSDMwM0M1NSZ9YXsqXGMmSDJGM0E1MiZ9dHsqXGMmSDJFMzk1MCZ9aXsqXGMmSDJDMzc0RSZ9b3sqXGMmSDJCMzU0QyZ9biB7KlxjJkgyODMyNDgmfSh7KlxjJkgyNjMwNDYmfUEgeypcYyZIMjMyRDQyJn0tIHsqXGMmSDIwMkEzRSZ9UHtcYyZIMUYyODNDJn0pIn0KRGF0YTogOCxhLW1vLGV7InV1aWQiIzNBImE4MGVlMzU2LTQ1MDgtNDM0MS04YjRmLTZkNzllMmFjMzhmYyIjMkMib3JpZ2luYWxUZXh0IiMzQSJ7XGZuRkZKdXN0bGVmdGhhbmRcZnM1MFxibHVyMC42XGZyejM0Ni4zXGMmSDJDM0M1OSZccG9zKDUxOS44NDIjMkMyNjQuOTUzKX1TcG90IG1pc3VzZSJ9CkRhdGE6IDksYS1tbyxleyJ1dWlkIiMzQSJkODU5NTQ1Zi0wZWI1LTRjZDEtODY1My0xYjBkOGQ0YjAxNWIiIzJDIm9yaWdpbmFsVGV4dCIjM0Eie1xmbkZGSnVzdGxlZnRoYW5kXGJsdXIwLjZcZnJ6MzQ2LjNcYyZIMkMzQzU5Jlxwb3MoNjAzLjU3MSMyQzIwNil9U3sqXGMmSDJCM0I1OCZ9YXsqXGMmSDJCM0E1NiZ9a3sqXGMmSDJBMzk1NSZ9YXsqXGMmSDI5Mzg1MyZ9eXsqXGMmSDI5Mzc1MiZ9YXsqXGMmSDI4MzY1MSZ9bnsqXGMmSDI4MzU0RiZ9YXsqXGMmSDI3MzQ0RSZ9Z3sqXGMmSDI2MzM0QyZ9aSB7KlxjJkgyNTMyNEEmfWR7KlxjJkgyNDMxNDgmfXJ7KlxjJkgyNDMwNDcmfW97KlxjJkgyMzJGNDUmfXB7KlxjJkgyMjJFNDQmfXB7KlxjJkgyMjJENDImfWl7KlxjJkgyMTJDNDEmfW57KlxjJkgyMTJCNDAmfWcgeypcYyZIMUYyOTNEJn1veypcYyZIMUYyODNCJn11e1xjJkgxRTI3M0EmfXQifQpEYXRhOiAxMSxhLW1vLGV7InV1aWQiIzNBIjQ2YzVjZjA2LTVlZmYtNDVjNy04NTgyLWJkMDZjZDVhZTc2MyIjMkMib3JpZ2luYWxUZXh0IiMzQSJ7XGZuUGVuY2lsZmllZFhcYmx1cjAuOFxjJkg0OTQxM0QmXHBvcyg2MTcuMTQzIzJDNjI5LjE0Myl9UntcYyZIMkMyNzI0Jn15dWVuIEtha2VydSJ9CkRhdGE6IDE0LGwwLk1vdmVBbG9uZ1BhdGgsZXsib3JnTGluZSIjM0Eie1xmbkhpcmEgdjhcZmF4MC4zNFxibHVyMC44XGZzMzRcYyZIMjYyMzIxJlxwb3MoNTY4IzJDMjY4KVxmcno0Ljc1MVxjbGlwKG0gMTg1IDMyMiBiIDM4OSAyOTMgNzk2IDI2NiAxMDAxIDI1Nyl9Q29udHJhY3QgZm9yIHRoZSBUcmFuc2ZlciBvZiBTcGVjaWFsIENhbXAgUG9pbnRzIiMyQyJzZXR0aW5ncyIjM0F7InJlbFBvcyIjM0FmYWxzZSMyQyJhbmlQb3MiIzNBdHJ1ZSMyQyJhbmlGcnoiIzNBdHJ1ZSMyQyJhY2NlbCIjM0ExIzJDImNmck1vZGUiIzNBdHJ1ZSMyQyJyZXZlcnNlTGluZSIjM0FmYWxzZSMyQyJmbGlwRnJ6IiMzQWZhbHNlfSMyQyJpZCIjM0EiYTllYTdhMjktOWM3Ny00MjdhLThlZWItMjk4MTMyZmM2MTliIn0KRGF0YTogMTUsbDAuTW92ZUFsb25nUGF0aCxleyJzZXR0aW5ncyIjM0F7InJlbFBvcyIjM0FmYWxzZSMyQyJhbmlQb3MiIzNBdHJ1ZSMyQyJhbmlGcnoiIzNBdHJ1ZSMyQyJhY2NlbCIjM0ExIzJDImNmck1vZGUiIzNBdHJ1ZSMyQyJyZXZlcnNlTGluZSIjM0FmYWxzZSMyQyJmbGlwRnJ6IiMzQWZhbHNlfSMyQyJpZCIjM0EiYTllYTdhMjktOWM3Ny00MjdhLThlZWItMjk4MTMyZmM2MTliIn0KRGF0YTogMTYsbDAuTW92ZUFsb25nUGF0aCxleyJvcmdMaW5lIiMzQSJ7XGZuSGlyYSB2OFxmYXgtMC4wN1xmczMwXGMmSDFDNTk4MCZcYmx1cjAuNlxmcnozNTguNlxwb3MoNTIwIzJDMjApXGNsaXAobSAzMTQgMjEgYiA0MTYgMjAgNjIxIDI3IDcyNSAzMyl9U3BlY2lhbCBDYW1wIENvbnRyYWN0IFRlcm1zIiMyQyJzZXR0aW5ncyIjM0F7InJlbFBvcyIjM0FmYWxzZSMyQyJhbmlQb3MiIzNBdHJ1ZSMyQyJhbmlGcnoiIzNBdHJ1ZSMyQyJhY2NlbCIjM0ExIzJDImNmck1vZGUiIzNBdHJ1ZSMyQyJyZXZlcnNlTGluZSIjM0FmYWxzZSMyQyJmbGlwRnJ6IiMzQWZhbHNlfSMyQyJpZCIjM0EiNTI2Mzc0ZjUtNjJjZi00ZmM0LWJlMDItMWU2MDkyNGI5Nzk5In0KRGF0YTogMTcsbDAuTW92ZUFsb25nUGF0aCxleyJzZXR0aW5ncyIjM0F7InJlbFBvcyIjM0FmYWxzZSMyQyJhbmlQb3MiIzNBdHJ1ZSMyQyJhbmlGcnoiIzNBdHJ1ZSMyQyJhY2NlbCIjM0ExIzJDImNmck1vZGUiIzNBdHJ1ZSMyQyJyZXZlcnNlTGluZSIjM0FmYWxzZSMyQyJmbGlwRnJ6IiMzQWZhbHNlfSMyQyJpZCIjM0EiNTI2Mzc0ZjUtNjJjZi00ZmM0LWJlMDItMWU2MDkyNGI5Nzk5In0KRGF0YTogMTgsYS1tbyxleyJ1dWlkIiMzQSIxMjk5NGIyNy0yN2Y1LTQwNGMtOWU3YS0wODlhNTg3ZDczZDEiIzJDIm9yaWdpbmFsVGV4dCIjM0Eie1xmblF1YWRyYWF0LUJvbGRcZnM2MFxibHVyMC41XGMmSEZFRkVGRSZccG9zKDEwMDYuNyMyQzI4NSl9RWxpdGUifQpEYXRhOiAxOSxhLW1vLGV7InV1aWQiIzNBIjg5ODE1NTMyLTEyNjAtNDQxYi1iOTQ4LTY4OTIzMGI5NDg3ZSIjMkMib3JpZ2luYWxUZXh0IiMzQSJ7XGZuUXVhZHJhYXQtQm9sZFxmczYwXGJsdXIwLjVcYyZIRkVGRUZFJlxwb3MoOTEyIzJDMjg1KX10aGUifQpEYXRhOiAyMCxhLW1vLGV7InV1aWQiIzNBIjk3NDNmNWY2LWJjNDktNDYzMy1iYjNmLTk1MWViYzkwZWJlZiIjMkMib3JpZ2luYWxUZXh0IiMzQSJ7XGZuUXVhZHJhYXQtQm9sZFxmczYwXGJsdXIwLjVcYyZIRkVGRUZFJlxwb3MoODQ0LjIjMkMyODUpfW9mIn0KRGF0YTogMjEsYS1tbyxleyJ1dWlkIiMzQSIzN2UzYjY5Mi04NjFhLTRlNmEtOGZjOC02NmY5ZTU0YTVjZTEiIzJDIm9yaWdpbmFsVGV4dCIjM0Eie1xmblF1YWRyYWF0LUJvbGRcZnM2MFxibHVyMC41XGMmSEZFRkVGRSZccG9zKDY5MS44IzJDMjg1KX1DbGFzc3Jvb20ifQpEYXRhOiAyMixhLW1vLGV7InV1aWQiIzNBIjJkMmQzM2I3LThjZDMtNDkyZC1hNTA3LWIyMjg4NGRlNDc5YSIjMkMib3JpZ2luYWxUZXh0IiMzQSJ7XGZuUXVhZHJhYXQtQm9sZFxmczYwXGJsdXIwLjVcYyZIRkVGRUZFJlxwb3MoNTI4LjQjMkMyODUpfXRoZSJ9CkRhdGE6IDIzLGEtbW8sZXsidXVpZCIjM0EiMDQyZjRiMWMtNjFkNy00MWRlLThiNjAtMDAyOWQ5MWM5MjIzIiMyQyJvcmlnaW5hbFRleHQiIzNBIntcZm5RdWFkcmFhdC1Cb2xkXGZzNjBcYmx1cjAuNVxjJkhGRUZFRkUmXHBvcyg0NjEuNiMyQzI4NSl9dG8ifQpEYXRhOiAyNCxhLW1vLGV7InV1aWQiIzNBIjUzMWI3OTEzLWE2NDUtNGM5OC1hMTA4LThlNmQ4YTk3ZmYzZCIjMkMib3JpZ2luYWxUZXh0IiMzQSJ7XGZuUXVhZHJhYXQtQm9sZFxmczYwXGJsdXIwLjVcYyZIRkVGRUZFJlxwb3MoMzI3LjIjMkMyODUpfVdlbGNvbWUifQo=`;

                        // $(".video")[0].appendChild(track)

                        // videojs('player', {
                        //     controls: true,
                        //     nativeControlsForTouch: false,
                        //     fluid: true,
                        //     plugins: {
                        //         ass: {
                        //             'src': [source],
                        //         }
                        //     },
                        // });
                    }
                }
            });
        }
    }

    //selecte a row on table
    selecte(id) {
        if (this.selected) this.selected.classList.remove("selected");
        this.selected = document.getElementsByClassName(`row-${id}`)[0];
        this.selected.classList.add("selected");
        let whotext = this.getSubtitle(id)

        if (whotext.value.Text != "") {
            this.textBoxElem.val(whotext.value.Text);
        }
        if (this.videoElem[0].src != '') {
            this.videoElem[0].currentTime = whotext.value.Start.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0)
        };
    }

    //add video src on video tag
    addVideo(src) {
        this.videoElem[0].src = src
    }

    //add subtitle on table and on var
    addSubtitles(opts, isInTheSubtitles = true) {
        const { Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text, count, id } = opts
        if (Array.isArray(opts) == true) return;
        let id2;
        if(!id){
            do {
                id2 = this.generateID();
            } while (!this.getSubtitle(id))
        }

        let text = `
        <tr class="row-${id ? id: id2}" onclick="subs.selecte('${id ? id: id2}')">
          <td>${count ? count : this.subtitles.length}</td>
          <td>${Start ? Start : '00:00:00'}</td>
          <td>${End ? End : '00:00:01'}</td>
          <td>20</td>
          <td>${Style ? Style : "Default"}</td>
          <td>${Text ? Text : ' '}</td>
        </tr>`
        this.subsListElem.append(text);

        if (isInTheSubtitles == false) {
            console.log(id2)
            this.subtitles.push({
                key: "Dialogue",
                value: {
                    Layer: "10",
                    Start: Start ? Start : '00:00:00',
                    End: End ? End : '00:00:01',
                    style: Style ? Style : "Default",
                    Name: Name ? Name : "ector",
                    MarginL: MarginL ? MarginL : "0",
                    MarginR: MarginR ? MarginR : "0",
                    MarginV: MarginV ? MarginV : "0",
                    Effect: "",
                    Text: Text ? Text : '',
                    id: id ? id: id2
                }
            })
        }
    }

    //get a subttile by id
    getSubtitle(id) {
        return this.subtitles.filter(x => x.value.id == id)[0] || false;
    }
    
    //generate a id
    generateID() {
        return 'xxxx-xxxx-xxxx-yxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

function toWebvtt(datas) {
    if (!datas) {
        this.data.filter(x => x.section == "Events")[0].body = this.subtitles;
        console.log(this.data)
        let converted = subsrt.convert(exportsTitles(this.data), { format: "vtt" })
        console.log(converted)
    } else {
        let converted = subsrt.convert(datas, { format: "vtt" })
        console.log(converted)
        return converted
    }
}