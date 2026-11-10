import Foundation
import Vision
import AppKit
import CoreImage

let src = URL(fileURLWithPath: CommandLine.arguments[1]); let dst = URL(fileURLWithPath: CommandLine.arguments[2])
let img=NSImage(contentsOf:src)!
var rect = CGRect(origin:.zero,size:img.size)
let cg=img.cgImage(forProposedRect:&rect,context:nil,hints:nil)!
let req=VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate
req.outputPixelFormat = kCVPixelFormatType_OneComponent8
let h=VNImageRequestHandler(cgImage:cg,options:[:])
do {
 try h.perform([req])
 let pb=req.results!.first!.pixelBuffer
 let ci=CIImage(cvPixelBuffer:pb)
 let ctx=CIContext()
 let scaled=ci.transformed(by:CGAffineTransform(scaleX:CGFloat(cg.width)/ci.extent.width,y:CGFloat(cg.height)/ci.extent.height))
 let colored=ctx.createCGImage(scaled,from:CGRect(x:0,y:0,width:cg.width,height:cg.height))!
 let rep=NSBitmapImageRep(cgImage:colored)
 let data=rep.representation(using:.png,properties:[:])!
 try data.write(to:dst)
 print("mask saved \(cg.width)x\(cg.height) \(dst.path)")
} catch { print("ERROR \(error)"); exit(2) }
