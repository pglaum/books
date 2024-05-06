import type { Point2D, } from "barcode-detector/pure"
import type { BarcodeFormat, } from "vue-qrcode-reader"

export interface DetectedBarcode {
    boundingBox: DOMRectReadOnly
    rawValue: string
    format: BarcodeFormat
    cornerPoints: Array<Point2D>
}
