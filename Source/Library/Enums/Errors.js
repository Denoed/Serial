
const {
    PermissionDenied , BadResource , TypeError , NotFound ,
    AddrInUse , ConnectionAborted , AddrNotAvailable ,
    ConnectionRefused , ConnectionReset , AlreadyExists ,
    Interrupted , OutOfMemory , Unsupported , NotConnected ,
    BrokenPipe , TimedOut , InvalidInput
} = Deno.errors;


export class OperationWouldBlock extends Error {

}

export default {

      1 : PermissionDenied ,
      2 : NotFound ,
      3 : NotFound ,
      4 : Interrupted ,
      // 5 : IOError ,
      // 6 : UnknownDeviceOrAddress ,
      // 7 : TooManyArguments ,
      // 8 : ExecutableFormatError ,
      // 9 : BadFileNumber ,
     10 : NotFound ,
     11 : OperationWouldBlock ,
     // 11 : TryAgain_OperationWouldBlock ,
     12 : OutOfMemory ,
     13 : PermissionDenied ,
     // 14 : BadAddress ,
     // 15 : BlockDeviceRequired ,
     // 16 : DeviceOrResourceBusy ,
     17 : AlreadyExists ,
     // 18 : CrossDeviceLink ,
     // 19 : NoSuchDevice ,
     // 20 : NotADirectory ,
     // 21 : IsADirectory ,
     22 : InvalidInput ,
     // 23 : FileTableOverflow ,
     // 24 : TooManyOpenFiles ,
     25 : BadResource ,
     // 26 : TextFileBusy ,
     // 27 : FileTooLarge ,
     // 28 : NoSpaceLeftOnDevice ,
     // 29 : IllegalSeek ,
     // 30 : ReadOnlyFileSystem ,
     // 31 : TooManyLinks ,
     32 : BrokenPipe ,
     // 33 : MathArgumentOutOfDomainOfFunction ,
     // 34 : MathResultNotRepresentable ,
     // 35 : ResourceDeadlockWouldOccur ,
     // 36 : FileNameTooLong ,
     // 37 : NoRecordLocksAvailable ,
     38 : Unsupported ,
     // 39 : DirectoryNotEmpty ,
     // 40 : TooManySymbolicLinksEncountered ,

     // 42 : NoMessageOfDesiredType ,
     // 43 : IdentifierRemoved ,
     // 44 : ChannelNumberOutOfRange ,
     // 45 : Level2NotSynchronized ,
     // 46 : Level3Halted ,
     // 47 : Level3Reset ,
     // 48 : LinkNumberOutOfRange ,
     // 49 : ProtocolDriverNotAttached ,
     // 50 : NoCSIStructureAvailable ,
     // 51 : Level2Halted ,
     // 52 : InvalidExchange ,
     // 53 : InvalidRequestDescriptor ,
     // 54 : ExchangeFull ,
     // 55 : NoAnode ,
     // 56 : InvalidRequestCode ,
     // 57 : InvalidSlot ,

     // 59 : BadFontFileFormat ,
     // 60 : DeviceNotAStream ,
     // 61 : NoDataAvailable ,
     // 62 : TimerExpired ,
     // 63 : OutOfStreamsResources ,
     // 64 : MachineIsNotOnTheNetwork ,
     // 65 : PackageNotInstalled ,
     // 66 : ObjectIsRemote ,
     // 67 : LinkHasBeenSevered ,
     // 68 : AdvertiseError ,
     // 69 : SrmountError ,
     // 70 : CommunicationErrorOnSend ,
     // 71 : ProtocolError ,
     // 72 : MultihopAttempted ,
     // 73 : RFSSpecificError ,
     // 74 : NootADataMessage ,
     // 75 : ValueTooLargeForDefinedDataType ,
     // 76 : NameNotUniqueOnNetwork ,
     // 77 : FileDescriptorInBadState ,
     // 78 : RemoteAddressChanged ,
     // 79 : CanNotAccessANeededSharedLibrary ,
     // 80 : AccessingACorruptedSharedLibrary ,
     // 81 : DotLibSectionInADotOutCorrupted ,
     // 82 : AttemptingToLinkInTooManySharedLibraries ,
     // 83 : CannotExecuteASharedLibraryDirectly ,
     // 84 : IllegalByteSequence ,
     // 85 : InterruptedSystemCallShouldBeRestarted ,
     // 86 : StreamsPipeError ,
     // 87 : TooManyUsers ,
     // 88 : SocketOperationOnNonSocket ,
     // 89 : DestinationAddressRequired ,
     // 90 : MessageTooLng ,
     // 91 : ProtocolWrongTypeForSocket ,
     // 92 : ProtocolNotAvailable ,
     // 93 : ProtocolNotSupported ,
     // 94 : SocketTypeNotSupported ,
     // 95 : OperationNotSupportedOnTransportEndpoint ,
     // 96 : ProtocolFamilyNotSupported ,
     // 97 : AddressFamilyNotSupportedByProtocol ,
     98 : AddrInUse ,
     99 : AddrNotAvailable ,
    // 100 : NetworkIsDown ,
    // 101 : NetworkIsUnreachable ,
    // 102 : NetworkDroppedConnectionBecauseOfReset ,
    103 : ConnectionAborted ,
    104 : ConnectionReset ,
    // 105 : NoBufferSpaceAvailable ,
    // 106 : TransportEndpointIsAlreadyConnected ,
    107 : NotConnected ,
    // 108 : CannotSendAfterTransportEndpointShutdown ,
    // 109 : TooManyReferencesCannotSplice ,
    110 : TimedOut ,
    111 : ConnectionRefused ,
    // 112 : HostIsDown ,
    // 113 : NoRouteToHost ,
    // 114 : OperationAlreadyInProgress ,
    // 115 : OperationNowInProgress ,
    // 116 : StaleFileHandle ,
    // 117 : StructureNeedsCleaning ,
    // 118 : NotAXENIXNamedTypeFile ,
    // 119 : NoXENIXSemaphoresAvailable ,
    // 120 : IsANamedTypeFile ,
    // 121 : RemoteIOError ,
    // 122 : QuotaExceeded ,
    // 123 : NoMediumFound ,
    // 124 : WrongMediumType ,
    // 125 : OperationCanceled ,
    // 126 : RequiredKeyNotAvailable ,
    // 127 : KeyHasExpired ,
    // 128 : KeyHasBeenRevoked ,
    // 129 : KeyWasRejectedBySerevice ,
    // 130 : OwnerDied ,
    // 131 : StateNotRecoverable ,
    // 132 : OperationNotPossibleDueToRFKill ,
    // 133 : MemoryPageHasHardwareError
}
